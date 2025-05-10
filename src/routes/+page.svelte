<script lang="ts">
	import TournamentTable from '../components/TournamentTable.svelte';
	import type {
		Players,
		PlayersDTO,
		PlayerStats,
		TournamentDTO,
		TournamentStats
	} from '../utils/data';
	import type { PageProps } from './$types';

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
	let tableView = $state(1);

	$inspect(tournaments);

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
			player: detail.playerId,
			wins: detail.wins,
			loses: detail.loses,
			draws: detail.draws,
			prizeCardsGained: detail.prizeCardsGained,
			prizeCardsLost: detail.prizeCardsLost
		})) as TableData[];
	});
</script>

<button class:selected={tableView === 0} onclick={() => changeTableView(0)}
	>Klasyfikacja generalna</button
>
<button class:selected={tableView === 1} onclick={() => changeTableView(1)}>Turniej 1</button>
<button class:selected={tableView === 2} onclick={() => changeTableView(2)}
	>Turniej 2 (01.05.2025)</button
>

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
</style>
