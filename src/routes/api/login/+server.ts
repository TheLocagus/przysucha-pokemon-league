import clientPromise from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { Db } from 'mongodb';

interface LoginInterface {
	username: string;
	password: string;
}

const createSession = async (db: Db, userId: string) => {
	const sessionId = randomUUID();
	const session = db.collection('sessions');

	try {
		await session.insertOne({
			id: sessionId,
			userId: userId,
			expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 dni
		});
	} catch (e) {
		return error(500, 'Error while creating session');
	}

	return sessionId;
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const client = await clientPromise;
	const db = client.db('pokemon-league');
	const { username, password }: LoginInterface = await request.json();

	const user = await db.collection('players').findOne({
		username: username
	});

	if (!user) {
		error(500, 'User doesnt exists');
	}

	const sessionId = await createSession(db, user._id.toString());

	cookies.set('session', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true
		// maxAge: 60 * 60 * 24 * 7
	});

	return new Response(
		JSON.stringify({
			user: {
				id: user._id.toString(),
				name: user.name,
				birthyear: user.birthyear,
				favouritePokemon: user.favouritePokemon
			},
			sessionId
		})
	);
};
