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
