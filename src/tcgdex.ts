import type TCGdex from '@tcgdex/sdk';
import { writable, type Writable } from 'svelte/store';

export const tcgdex: Writable<TCGdex | undefined> = writable();
