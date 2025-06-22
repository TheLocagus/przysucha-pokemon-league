import type { PlayersDTO, TournamentDTO } from '$types';

export const load = async ({ fetch }) => {
	const tournaments: TournamentDTO[] = await (await fetch('/api/tournaments')).json();
	const players: PlayersDTO[] = await (await fetch('/api/players')).json();

	return {
		players,
		tournaments
	};
};
