import clientPromise from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export interface AddResultBody {
	tournamentId: string;
	playerOne: {
		playerId: string;
		name: string;
		points: number;
	};
	playerTwo: {
		playerId: string;
		name: string;
		points: number;
	};
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { tournamentId, playerOne, playerTwo }: AddResultBody = await request.json();
		const client = await clientPromise;
		const db = client.db('pokemon-league');
		const matchesDb = db.collection('matches');

		if (!tournamentId || !playerOne.playerId || !playerTwo.playerId) throw Error('Invalid body');
		if (
			isNaN(playerOne.points) ||
			playerOne.points < 0 ||
			playerOne.points > 6 ||
			isNaN(playerTwo.points) ||
			playerTwo.points < 0 ||
			playerTwo.points > 6 ||
			(playerOne.points !== 6 && playerTwo.points !== 6)
		)
			throw Error('Invalid points');

		// const isDraw = playerOne.points === 6 && playerTwo.points === 6;

		await matchesDb.insertOne({
			_id: new ObjectId(),
			tournamentId: new ObjectId(tournamentId),
			playerOne: {
				_id: new ObjectId(playerOne.playerId),
				name: playerOne.name,
				score: playerOne.points
			},
			playerTwo: {
				_id: new ObjectId(playerTwo.playerId),
				name: playerTwo.name,
				score: playerTwo.points
			}
		});

		// await matchesDb.insertOne(
		// 	{ _id: new ObjectId(tournamentId), 'details.playerId': new ObjectId(playerOne.playerId) },
		// 	{
		// 		$inc: {
		// 			'details.$.prizeCardsGained': playerOne.points,
		// 			'details.$.prizeCardsLost': playerTwo.points,
		// 			'details.$.wins': playerOne.points > playerTwo.points ? 1 : 0,
		// 			'details.$.loses': playerOne.points < playerTwo.points ? 1 : 0,
		// 			'details.$.draws': isDraw ? 1 : 0
		// 		},
		// 		$push: {
		// 			'details.$.results': {
		// 				opponentId: new ObjectId(playerTwo.playerId),
		// 				result: isDraw ? 'draw' : playerOne.points > playerTwo.points ? 'win' : 'lose',
		// 				prizeCardsGained: playerOne.points,
		// 				prizeCardsLost: playerTwo.points
		// 			}
		// 		}
		// 	} as never
		// );

		// await matchesDb.updateOne(
		// 	{ _id: new ObjectId(tournamentId), 'details.playerId': new ObjectId(playerTwo.playerId) },
		// 	{
		// 		$inc: {
		// 			'details.$.prizeCardsGained': playerTwo.points,
		// 			'details.$.prizeCardsLost': playerOne.points,
		// 			'details.$.wins': playerTwo.points > playerOne.points ? 1 : 0,
		// 			'details.$.loses': playerTwo.points < playerOne.points ? 1 : 0,
		// 			'details.$.draw': isDraw ? 1 : 0
		// 		},
		// 		$push: {
		// 			'details.$.results': {
		// 				opponentId: new ObjectId(playerOne.playerId),
		// 				result: isDraw ? 'draw' : playerTwo.points > playerOne.points ? 'win' : 'lose',
		// 				prizeCardsGained: playerTwo.points,
		// 				prizeCardsLost: playerOne.points
		// 			}
		// 		}
		// 	} as never
		// );
	} catch (e: unknown) {
		error(500, (e as Error).message);
	}

	return new Response();
};
