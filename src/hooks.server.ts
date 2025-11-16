import { getUserBySession } from '$lib/auth';

export const handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');
	if (sessionId) {
		const userData = await getUserBySession(sessionId);
		if (userData) {
			event.locals.user = userData.userId;
			event.locals.admin = userData.role === 'admin';
		}
	}

	return resolve(event);
};
