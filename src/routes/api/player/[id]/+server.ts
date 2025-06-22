import clientPromise from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ params }) => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');
	const player = await db
		.collection('players')
		.find({
			_id: { $eq: new ObjectId(params.id) }
		})
		.toArray();

	const matches = await db.collection('matches').find().toArray();

	const history = matches.filter(
		(match) =>
			match.playerOne._id.toString() === params.id || match.playerTwo._id.toString() === params.id
	);

	return new Response(
		JSON.stringify({
			player,
			history
		})
	);
};
