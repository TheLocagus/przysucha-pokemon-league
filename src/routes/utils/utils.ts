import { writable, type Writable } from 'svelte/store';

export const notifications: Writable<
	{
		isPositive: boolean;
		message: string;
	}[]
> = writable([]);

export const setNotifications = (message: string, isPositive = true) => {
	notifications.update((value) => [
		...value,
		{
			isPositive,
			message
		}
	]);
};

export const pokemonFetch = async (url: string, method: string, body?: Record<string, unknown>) => {
	await fetch(url, {
		method,
		body: JSON.stringify(body) ?? undefined,
		headers: {
			'X-Api-Key': '2ec9c62b-c4d4-436f-8936-8f79cb98b38f'
		}
	});
};
