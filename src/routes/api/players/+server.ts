import clientPromise from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');

	const players = await db.collection('players').find().toArray();
	return new Response(JSON.stringify(players));
};
