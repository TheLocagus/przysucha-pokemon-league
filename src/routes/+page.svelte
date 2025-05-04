<script lang="ts">
	import TournamentTable from '../components/TournamentTable.svelte';
	import type { Players, PlayerStats, TournamentStats } from '../utils/data';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const database = data.database;
	let tableView = $state('first');

	const changeTableView = (view: string) => {
		console.log(view);
		tableView = view;
	};

	const tournamentData = $derived.by(() => {
		if (tableView === 'all') {
			const players: Players[] = Object.keys(database.first) as Players[];

			const defaultPlayersStats: TournamentStats = Object.fromEntries(
				players.map<[Players, PlayerStats]>((player) => [
					player,
					{
						wins: 0,
						loses: 0,
						draws: 0,
						pokemonsDefeated: 0,
						pokemonsLost: 0,
						deckType: [],
						detailsResults: undefined
					}
				])
			) as TournamentStats;

			const result = Object.values(database).reduce((acc, curr) => {
				console.log({ acc });
				return Object.fromEntries(
					players.map((player) => [
						player,
						{
							wins: (acc[player]?.wins ?? 0) + (curr[player]?.wins ?? 0),
							loses: (acc[player]?.loses ?? 0) + (curr[player]?.loses ?? 0),
							draws: (acc[player]?.draws ?? 0) + (curr[player]?.draws ?? 0),
							pokemonsDefeated:
								(acc[player]?.pokemonsDefeated ?? 0) + (curr[player]?.pokemonsDefeated ?? 0),
							pokemonsLost: (acc[player]?.pokemonsLost ?? 0) + (curr[player]?.pokemonsLost ?? 0),
							deckType: [...(acc[player]?.deckType ?? []), ...(curr[player]?.deckType ?? [])]
						}
					])
				);
			}, defaultPlayersStats);

			console.log({ result });

			return result;
		}
		return database[tableView];
	});
</script>

<button class:selected={tableView === 'all'} onclick={() => changeTableView('all')}
	>Klasyfikacja generalna</button
>
<button class:selected={tableView === 'first'} onclick={() => changeTableView('first')}
	>Turniej 1</button
>
<button class:selected={tableView === 'second'} onclick={() => changeTableView('second')}
	>Turniej 2 (01.05.2025)</button
>

{#if tournamentData}
	<TournamentTable {tournamentData} {tableView} />
{/if}

<style>
	.selected {
		padding: 5px 10px;
		background-color: rgb(209, 231, 13);
		color: black;
		border: 1px solid black;
		border-radius: 5px;
	}
</style>
