import clientPromise from '$lib/server/db';
import type { PlayerScoreDTO } from '$types';
import type { RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

interface Match {
	_id: ObjectId;
	tournamentId: ObjectId;
	playerOne: PlayerScoreDTO;
	playerTwo: PlayerScoreDTO;
}

export const GET: RequestHandler = async ({ params }) => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');
	const player = await db
		.collection('players')
		.find({
			_id: { $eq: new ObjectId(params.id) }
		})
		.toArray();

	const matches: Match[] = (await db.collection('matches').find().toArray()) as unknown as Match[];

	const history = matches.filter(
		(match) =>
			match.playerOne._id.toString() === params.id || match.playerTwo._id.toString() === params.id
	);

	const tournamentsMatches = history.reduce((acc: Record<string, Match[]>, match: Match) => {
		console.log({ acc, match });
		return {
			...acc,
			[match.tournamentId.toString()]: [...(acc[match.tournamentId.toString()] ?? []), match]
		};
	}, {});

	return new Response(
		JSON.stringify({
			player: player[0],
			tournamentsMatches
		})
	);
};
