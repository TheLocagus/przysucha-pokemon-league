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

		const details = players.map((playerId) => ({
			playerId: new ObjectId(playerId),
			wins: 0,
			loses: 0,
			draws: 0,
			prizeCardsGained: 0,
			prizeCardsLost: 0,
			results: []
		}));

		await tournamentsDb.insertOne({
			_id: new ObjectId(),
			tournamentCount: count,
			date,
			details,
			status: 'in-progress'
		});
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
