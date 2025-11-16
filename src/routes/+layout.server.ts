import type { PlayersDTO, TournamentDTO } from '$types';
import { redirect } from '@sveltejs/kit';
import TCGdex from '@tcgdex/sdk';

export const load = async ({ fetch, locals, route }) => {
	const tournaments: TournamentDTO[] = await (await fetch('/api/tournaments')).json();
	const players: PlayersDTO[] = await (await fetch('/api/players')).json();
	// const tcgdex = new TCGdex('en');

	if (!locals.user && route.id !== '/login') {
		throw redirect(303, '/login');
	}

	if (!locals.admin && route.id === '/admin') {
		throw redirect(303, '/no-access');
	}

	const loggedUser: PlayersDTO = locals.user
		? await (await fetch(`/api/auth/player/${locals.user}`)).json()
		: undefined;

	console.log({ loggedUser });

	return {
		players,
		tournaments,
		// tcgdex,
		user: loggedUser
	};
};
