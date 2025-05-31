import clientPromise from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ params }) => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');
	const tournamentId = params.id;

	const matches = await db
		.collection('matches')
		.find({
			tournamentId: { $eq: new ObjectId(tournamentId) }
		})
		.toArray();

	return new Response(JSON.stringify(matches));
};
