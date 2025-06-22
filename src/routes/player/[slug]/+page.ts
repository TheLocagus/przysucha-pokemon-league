import type { PlayersDTO } from '$types';

export const load = async ({ fetch, params }) => {
	const player: PlayersDTO = await (await fetch(`/api/player/${params.slug}`)).json();
	return {
		player
	};
};
