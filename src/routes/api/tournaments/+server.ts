import clientPromise from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async () => {
	const client = await clientPromise;

	const db = client.db('pokemon-league');
	const tournaments = await db.collection('tournaments').find().toArray();
	return new Response(JSON.stringify(tournaments));
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const client = await clientPromise;
		const db = client.db('pokemon-league');
		const tournamentsDb = db.collection('tournaments');

		await tournamentsDb.insertOne({
			_id: new ObjectId(),
			tournamentCount: body.count,
			date: body.date,
			details: []
		});
	} catch (e: unknown) {
		error(500, (e as Error).message);
	}

	return new Response();
};
