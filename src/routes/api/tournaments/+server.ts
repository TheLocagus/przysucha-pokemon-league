import clientPromise from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

interface PostBody {
	count: number;
	date: string;
	players: string[];
}

interface DeleteBody {
	ids: string[];
}

interface PutBody {
	tournamentsIds: string[];
}

export const GET: RequestHandler = async () => {
	const client = await clientPromise;

	const db = client.db('pokemon-league');
	const tournaments = await db.collection('tournaments').find().toArray();
	return new Response(JSON.stringify(tournaments));
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { count, date, players }: PostBody = await request.json();
		const client = await clientPromise;
		const db = client.db('pokemon-league');
		const tournamentsDb = db.collection('tournaments');

		if (!players || !date || !count) throw Error('Incorrect body');

		await tournamentsDb.insertOne({
			_id: new ObjectId(),
			tournamentCount: count,
			date,
			players,
			status: 'in-progress'
		});
	} catch (e: unknown) {
		error(500, (e as Error).message);
	}

	return new Response();
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const body: PutBody = await request.json();
		const client = await clientPromise;
		const db = client.db('pokemon-league');
		const tournamentsDb = db.collection('tournaments');

		for await (const id of body.tournamentsIds) {
			await tournamentsDb.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'finished' } });
		}
	} catch (e: unknown) {
		error(500, (e as Error).message);
	}

	return new Response();
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { ids }: DeleteBody = await request.json();
		const client = await clientPromise;
		const db = client.db('pokemon-league');
		const tournamentsDb = db.collection('tournaments');

		for await (const id of ids) {
			await tournamentsDb.deleteOne({ _id: new ObjectId(id) });
		}
	} catch (e: unknown) {
		error(500, (e as Error).message);
	}

	return new Response();
};
