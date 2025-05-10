<script lang="ts">
	import type {
		DeckTypes,
		Players,
		PlayersDTO,
		TournamentDetails,
		TournamentDTO,
		TournamentStats
	} from '../utils/data';

	let {
		tableData,
		tableView
	}: {
		tableData: TableData[];
		tableView: number;
	} = $props();

	interface TableData {
		player: string;
		wins: number;
		loses: number;
		draws: number;
		prizeCardsGained: number;
		prizeCardsLost: number;
	}
	console.log(tableData);

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
			id: 'prizeCardsGained',
			label: 'Pokonane pokemony'
		},
		{
			id: 'prizeCardsLost',
			label: 'Stracone pokemony'
		}
	];

	const getBackgroundColor = (value: unknown) => {
		if (typeof value === 'undefined') return '#ccc';
		return '#fff';
	};

	const sortedTableData = $derived.by(() => {
		if (tableView === 1) {
			return tableData.toSorted((a, b) => (b?.prizeCardsGained ?? 0) - (a?.prizeCardsGained ?? 0));
		} else {
			return tableData.toSorted((a, b) => {
				if ((b?.wins ?? 0) - (a?.wins ?? 0) === 0) {
					return (b?.prizeCardsGained ?? 0) - (a?.prizeCardsGained ?? 0);
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
		padding: 20px 1px;
	}
</style>
