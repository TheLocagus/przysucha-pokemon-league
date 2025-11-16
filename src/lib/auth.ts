import { writable, type Writable } from 'svelte/store';
import clientPromise from './server/db';
import { ObjectId } from 'mongodb';

export async function getUserBySession(sessionId: string) {
	const client = await clientPromise;
	const db = client.db('pokemon-league');
	const session = await db.collection('sessions').findOne({
		id: sessionId
	});
	if (!session) return null;

	const user = await db.collection('players').findOne({
		_id: new ObjectId(session.userId)
	});

	if (!user) return null;
	// if (session.expiresAt < new Date()) return null;
	return { userId: session.userId, role: user.role };
}
