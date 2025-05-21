import clientPromise from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { ObjectId } from 'mongodb';

export interface MatchesDto {
	_id: ObjectId;
	tournamentId: string;
	playerOne: {
		_id: ObjectId;
		name: string;
		score: number;
	};
	playerTwo: {
		_id: ObjectId;
		name: string;
		score: number;
	};
}

export const GET: RequestHandler = async () => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');

	const players = await db.collection('players').find().toArray();
	const matches = await db.collection('matches').find().toArray();

	// console.log(matches);

	const playersIds = players.map((player) => player._id.toString());
	const playersStats = playersIds.reduce((playersStats, playerId) => {
		const filteredMatches = matches.filter(
			(match) =>
				match.playerOne._id.toString() === playerId || match.playerTwo._id.toString() === playerId
		);

		const scores = filteredMatches.reduce(
			(score, match) => {
				const player =
					match.playerOne._id.toString() === playerId ? match.playerOne : match.playerTwo;
				const opponent =
					match.playerOne._id.toString() === playerId ? match.playerTwo : match.playerOne;

				console.log({ playerId });
				console.log({ player, opponent });

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
			...playersStats,
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
