import clientPromise from '$lib/server/db';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');

	const sessionId = cookies.get('session');

	db.collection('sessions').deleteOne({
		id: sessionId
	});

	cookies.delete('session', {
		path: '/'
	});

	return new Response();
};
