import clientPromise from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const client = await clientPromise;
		const db = client.db('pokemon-league');
		const playerId = params.id;

		const matches = await db.collection('matches').find().toArray();

		const history = matches.filter(
			(match) =>
				match.playerOne._id.toString() === playerId || match.playerTwo._id.toString() === playerId
		);

		return new Response(JSON.stringify(history));
	} catch (e: unknown) {
		error(500, (e as Error).message);
	}
};
