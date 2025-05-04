<script lang="ts">
	import type { DeckTypes, Players, TournamentStats } from '../utils/data';

	let {
		tournamentData,
		tableView
	}: {
		tournamentData: TournamentStats;
		tableView: string;
	} = $props();

	interface TableData {
		player: keyof TournamentStats;
		wins: number | undefined;
		loses: number | undefined;
		draws: number | undefined;
		pokemonsDefeated: number | undefined;
		pokemonsLost: number | undefined;
		deckType: DeckTypes[] | undefined;
	}

	const tableData: TableData[] = $derived(
		Object.entries(tournamentData).map(([user, stats]) => {
			const player = user as Players;
			return {
				player,
				wins: stats?.wins,
				loses: stats?.loses,
				draws: stats?.draws,
				pokemonsDefeated: stats?.pokemonsDefeated,
				pokemonsLost: stats?.pokemonsLost,
				deckType: stats?.deckType
			};
		})
	);

	const columns = [
		{
			id: 'wins',
			label: 'Zwycięstwa'
		},
		{
			id: 'draws',
			label: 'Remisy'
		},
		{
			id: 'loses',
			label: 'Porażki'
		},
		{
			id: 'pokemonsDefeated',
			label: 'Pokonane pokemony'
		},
		{
			id: 'pokemonsLost',
			label: 'Stracone pokemony'
		}
	];

	const getBackgroundColor = (value: unknown) => {
		if (typeof value === 'undefined') return '#ccc';
		return '#fff';
	};

	const sortedTableData = $derived.by(() => {
		if (tableView === 'first') {
			return tableData.toSorted((a, b) => (b?.pokemonsDefeated ?? 0) - (a?.pokemonsDefeated ?? 0));
		} else {
			return tableData.toSorted((a, b) => {
				if ((b?.wins ?? 0) - (a?.wins ?? 0) === 0) {
					return (b?.pokemonsDefeated ?? 0) - (a?.pokemonsDefeated ?? 0);
				}
				return (b?.wins ?? 0) - (a?.wins ?? 0);
			});
		}
	});
</script>

<div class="table-wrapper">
	<table style:width="80%">
		<thead>
			<tr>
				<th id="placement"></th>
				<th id="player"></th>
				{#each columns as column (column.id)}
					<th id={column.id}>{column.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedTableData as data, i (data.player)}
				<tr>
					<td>{i + 1}.</td>
					<td>{data.player}</td>
					{#each columns as column (column.id)}
						<td
							style:text-align="center"
							style:background-color={getBackgroundColor(data[column.id as keyof TableData])}
						>
							{data[column.id as keyof TableData]}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-wrapper {
		display: flex;
		justify-content: center;
	}

	table {
		border: none;
		border-spacing: 0;
	}

	tbody tr td {
		padding: 20px 0;
	}
</style>
