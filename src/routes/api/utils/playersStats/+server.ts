import clientPromise from '$lib/server/db';
import type { MatchesDto, PlayersStats } from '$types';
import { error, type RequestHandler } from '@sveltejs/kit';
import { getScores } from '../../../utils/backend';

export const GET: RequestHandler = async () => {
	try {
		const client = await clientPromise;
		const db = client.db('pokemon-league');

		const players = await db.collection('players').find().toArray();
		const matches = (await db.collection('matches').find().toArray()) as MatchesDto[];

		const playersIds = players.map((player) => player._id.toString());
		const playersStats = playersIds.reduce((playerStats: PlayersStats[], playerId) => {
			const filteredMatches = matches.filter(
				(match) =>
					match.playerOne._id.toString() === playerId || match.playerTwo._id.toString() === playerId
			);

			const scores = getScores(filteredMatches, playerId);

			return [
				...playerStats,
				{
					playerId,
					wins: scores.wins,
					loses: scores.loses,
					draws: scores.draws,
					prizeCardsGained: scores.prizeCardsGained,
					prizeCardsLost: scores.prizeCardsLost
				}
			];
		}, []);
		return new Response(JSON.stringify(playersStats));
	} catch (e: unknown) {
		error(500, (e as Error).message);
	}
};
