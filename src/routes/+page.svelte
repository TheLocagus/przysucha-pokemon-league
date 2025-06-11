<script lang="ts">
	import { onMount } from 'svelte';
	import TournamentTable from '../components/TournamentTable.svelte';
	import type { PageProps } from './$types';
	import type { PlayersDTO, PlayersStats, TournamentDTO } from '$types';
	import TournamentDetails from '../components/TournamentDetails.svelte';

	let { data }: PageProps = $props();

	onMount(async () => {
		tableData = await getTableData(tournament);
	});

	const tournaments: TournamentDTO[] = data.tournaments;
	const players: PlayersDTO[] = data.players;
	let tableData: PlayersStats[] = $state([]);
	let tournament: TournamentDTO | undefined = $state(undefined);

	const getTableData = async (tournament: TournamentDTO | undefined) => {
		if (!tournament) {
			const res = await fetch(`/api/utils/playersStats`);
			return res.json();
		}

		const res = await fetch(`/api/utils/tournamentsStats/${tournament._id}`);
		return res.json();
	};

	$effect(() => {
		getTableData(tournament).then((res) => {
			tableData = res;
		});
	});
</script>

<div class="leaderboards">
	<div class="general-leaderboard">
		<button class:selected={tournament === undefined} onclick={() => (tournament = undefined)}
			>Klasyfikacja generalna</button
		>
	</div>
	<div class="tournaments-leaderboards">
		{#each tournaments as tournamentBtn}
			{@const count = tournamentBtn.tournamentCount}
			<button
				class:selected={tournament?._id === tournamentBtn._id}
				onclick={() => (tournament = tournamentBtn)}>Turniej {count}</button
			>
		{/each}
	</div>
</div>

{#if tableData}
	<TournamentTable {tableData} {tournament} {players} />
	{#if tournament !== undefined}
		<TournamentDetails tournamentId={tournament._id} />
	{/if}
{/if}

<style>
	button:not(.selected) {
		background-color: white;
		border: 1px solid black;
		color: black;
		padding: 7px 20px;
		border-radius: 5px;
		cursor: pointer;
	}

	.selected {
		padding: 7px 20px;
		background-color: var(--intense-red);
		color: white;
		border: 1px solid black;
		border-radius: 5px;
		cursor: pointer;
	}

	.leaderboards {
		display: flex;
		margin: 20px 0;
	}

	.general-leaderboard {
		flex-basis: 20%;
		display: flex;
		justify-content: center;
	}

	.tournaments-leaderboards {
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		gap: 5px;
		margin-right: 30px;
	}
</style>
