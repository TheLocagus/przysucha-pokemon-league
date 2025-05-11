<script lang="ts">
	import { getContext } from 'svelte';
	import type {
		DeckTypes,
		Players,
		PlayersDTO,
		TournamentDetails,
		TournamentDTO,
		TournamentStats
	} from '../utils/data';
	import type { Readable } from 'svelte/store';
	import Trophy from 'svelte-material-icons/Trophy.svelte';

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
			label: 'Zwycięstwa',
			color: 'green',
			width: '15%'
		},
		{
			id: 'draws',
			label: 'Remisy',
			color: 'blue',
			width: '15%'
		},
		{
			id: 'loses',
			label: 'Porażki',
			color: 'red',
			width: '15%'
		},
		{
			id: 'prizeCardsGained',
			label: 'Zdobyte karty nagród'
		},
		{
			id: 'prizeCardsLost',
			label: 'Stracone karty nagród'
		}
	];

	const getBackgroundColor = (value: unknown) => {
		if (typeof value === 'undefined') return '#ccc';
		return '#fff0';
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
	<table style:width="100%">
		<thead>
			<tr>
				<th id="placement"></th>
				<th id="player"></th>
				{#each columns as column (column.id)}
					<th
						id={column.id}
						style:font-size="20px"
						style:color={column.color ?? 'black'}
						style:width={column.width ?? 'auto'}>{column.label}</th
					>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedTableData as data, i (data.player)}
				<tr>
					<td style:text-align="center">
						{#if i === 0}
							<Trophy size="36" color="#e5c82c" />
						{:else if i === 1}
							<Trophy size="36" color="silver" />
						{:else if i === 2}
							<Trophy size="36" color="brown" />
						{:else}
							<span>{i + 1}.</span>
						{/if}
					</td>
					<td style:font-weight="bold">{data.player}</td>
					{#each columns as column (column.id)}
						<td
							style:text-align="center"
							style:background-color={getBackgroundColor(data[column.id as keyof TableData])}
							style:font-size="18px"
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
		background-color: rgba(250, 248, 250, 0.5);
		border-radius: 10px;
		letter-spacing: 1px;
	}

	tbody tr td {
		padding: 40px 1px;
	}
</style>
