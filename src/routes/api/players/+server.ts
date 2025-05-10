import type { RequestHandler } from '@sveltejs/kit';
import clientPromise from '../../+layout.server';

export const GET: RequestHandler = async () => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');

	const players = await db.collection('players').find().toArray();
	return new Response(JSON.stringify(players));
};
