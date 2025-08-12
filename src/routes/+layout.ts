import type { PlayersDTO, TournamentDTO } from '$types';
import TCGdex from '@tcgdex/sdk';

export const load = async ({ fetch }) => {
	const tournaments: TournamentDTO[] = await (await fetch('/api/tournaments')).json();
	const players: PlayersDTO[] = await (await fetch('/api/players')).json();
	const tcgdex = new TCGdex('en');

	return {
		players,
		tournaments,
		tcgdex
	};
};
