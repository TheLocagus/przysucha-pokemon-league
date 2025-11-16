import clientPromise from '$lib/server/db';
import type { DeckForm } from '$types';
import { error, type RequestHandler } from '@sveltejs/kit';
import { ObjectId, type PushOperator } from 'mongodb';

// CREATE NEW DECK
export const POST: RequestHandler = async ({ request, params, locals }) => {
	if (!locals.user) {
		return error(401, 'Unauthorized');
	}
	try {
		const { name, cards }: DeckForm = await request.json();
		const userId = params.id;
		const client = await clientPromise;
		const db = client.db('pokemon-league');

		if (locals.user !== userId) {
			return error(401, 'Unauthorized');
		}

		//Create field decks if not existed
		await db.collection('players').updateOne(
			{ _id: { $eq: new ObjectId(userId) }, decks: { $exists: false } },
			{
				$set: { decks: [] }
			}
		);

		//UpdateOne to add deck
		await db.collection('players').updateOne(
			{ _id: { $eq: new ObjectId(userId) } },
			{
				$push: {
					decks: {
						_id: new ObjectId(),
						name,
						cards
					}
				} as PushOperator<Document>
			}
		);

		return new Response();
	} catch (e) {
		return error(500, (e as Error).message);
	}
};
