<script lang="ts">
	import { setContext } from 'svelte';
	import TournamentTable from '../components/TournamentTable.svelte';
	import type {
		Players,
		PlayersDTO,
		PlayerStats,
		TournamentDTO,
		TournamentStats
	} from '../utils/data';
	import type { PageProps } from './$types';
	import { readable, writable } from 'svelte/store';

	let { data }: PageProps = $props();

	interface TableData {
		player: string;
		wins: number;
		loses: number;
		draws: number;
		prizeCardsGained: number;
		prizeCardsLost: number;
	}

	const tournaments: TournamentDTO[] = data.tournaments;
	const players: PlayersDTO[] = data.players;

	setContext('playersContext', readable(players));
	let tableView = $state(1);

	const getPlayerNameById = (id: string) => {
		return players.find((player) => player._id === id)?.name ?? '-----';
	};

	const changeTableView = (view: number) => {
		console.log(view);
		tableView = view;
	};

	const tournament = $derived(tournaments.find((t) => t.tournamentCount === tableView));
	const tableData: TableData[] = $derived.by(() => {
		if (tableView === 0)
			return players.map((player) => ({
				player: player.name,
				wins: player.wins,
				loses: player.loses,
				draws: player.draws,
				prizeCardsGained: player.prizeCardsGained,
				prizeCardsLost: player.prizeCardsLost
			})) as TableData[];
		return tournament?.details.map((detail) => ({
			player: getPlayerNameById(detail.playerId),
			wins: detail.wins,
			loses: detail.loses,
			draws: detail.draws,
			prizeCardsGained: detail.prizeCardsGained,
			prizeCardsLost: detail.prizeCardsLost
		})) as TableData[];
	});
</script>

<div class="leaderboards">
	<div class="general-leaderboard">
		<button class:selected={tableView === 0} onclick={() => changeTableView(0)}
			>Klasyfikacja generalna</button
		>
	</div>
	<div class="tournaments-leaderboards">
		{#each tournaments as tournament}
			{@const count = tournament.tournamentCount}
			<button class:selected={tableView === count} onclick={() => changeTableView(count)}
				>Turniej {count}</button
			>
		{/each}
	</div>
</div>

{#if tableData}
	<TournamentTable {tableData} {tableView} />
{/if}

<style>
	.selected {
		padding: 5px 10px;
		background-color: rgb(209, 231, 13);
		color: black;
		border: 1px solid black;
		border-radius: 5px;
	}

	.leaderboards {
		display: flex;
		margin: 20px 0;
	}

	.general-leaderboard {
		flex-basis: 20%;
	}

	.tournaments-leaderboards {
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		gap: 5px;
	}
</style>
