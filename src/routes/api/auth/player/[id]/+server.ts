import clientPromise from '$lib/server/db';
import type { PlayersDTO } from '$types';
import type { RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ request, cookies, params }) => {
	const playerId = params.id;
	const client = await clientPromise;
	const db = client.db('pokemon-league');
	const player = (await db.collection('players').findOne({
		_id: new ObjectId(playerId)
	})) as unknown as PlayersDTO;

	return new Response(JSON.stringify(player));
};
