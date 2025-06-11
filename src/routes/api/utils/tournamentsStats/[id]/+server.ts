import clientPromise from '$lib/server/db';
import type { PlayersStats } from '$types';
import type { RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ params }) => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');

	const tournamentId = params.id;
	const tournamentInfo = await db
		.collection('tournaments')
		.find({
			_id: { $eq: new ObjectId(tournamentId) }
		})
		.toArray();

	const playersIds: string[] = tournamentInfo[0].players;
	const matches = await db
		.collection('matches')
		.find({
			tournamentId: { $eq: new ObjectId(tournamentId) },
			$or: [
				{ 'playerOne._id': { $in: playersIds.map((id) => new ObjectId(id)) } },
				{ 'playerTwo._id': { $in: playersIds.map((id) => new ObjectId(id)) } }
			]
		})
		.toArray();

	const playersStats = playersIds.reduce((playerStats: PlayersStats[], playerId: string) => {
		const scores = matches.reduce(
			(score, match) => {
				if (
					match.playerOne._id.toString() !== playerId.toString() &&
					match.playerTwo._id.toString() !== playerId.toString()
				) {
					return score;
				}

				const player =
					match.playerOne._id.toString() === playerId.toString()
						? match.playerOne
						: match.playerTwo;
				const opponent =
					match.playerOne._id.toString() === playerId.toString()
						? match.playerTwo
						: match.playerOne;

				if (player.score > opponent.score) score.wins++;
				else if (player.score < opponent.score) score.loses++;
				else score.draws++;

				score.prizeCardsGained += player.score;
				score.prizeCardsLost += opponent.score;

				return score;
			},
			{
				wins: 0,
				loses: 0,
				draws: 0,
				prizeCardsGained: 0,
				prizeCardsLost: 0
			}
		);
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
};
