import { writable, type Writable } from 'svelte/store';

export const notifications: Writable<
	{
		isPositive: boolean;
		message: string;
	}[]
> = writable([]);
