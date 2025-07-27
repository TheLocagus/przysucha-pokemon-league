import type { PlayerProfileDTO } from '$types';

export const load = async ({ fetch, params }) => {
	const player: PlayerProfileDTO = await (await fetch(`/api/player/${params.slug}`)).json();
	return {
		player
	};
};
