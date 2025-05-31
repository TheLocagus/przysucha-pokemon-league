<script lang="ts">
	import Trophy from 'svelte-material-icons/Trophy.svelte';
	import type { PlayersDTO, PlayersStats } from '$types';

	let {
		tableData,
		tournamentId,
		players
	}: {
		tableData: PlayersStats[];
		tournamentId: string | undefined;
		players: PlayersDTO[];
	} = $props();

	const columns = [
		{
			id: 'wins',
			label: 'Zwycięstwa',
			width: '15%'
		},
		{
			id: 'draws',
			label: 'Remisy',
			width: '15%'
		},
		{
			id: 'loses',
			label: 'Porażki',
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

	const sortedTableData = $derived.by(() => {
		if (tournamentId === undefined) {
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

	const getPlayerNameById = (id: string) => {
		return players.find((player) => player._id === id)?.name ?? '-----';
	};
</script>

<div class="table-wrapper">
	<table>
		<thead class="dark-background">
			<tr>
				<th id="placement"></th>
				<th id="player"></th>
				{#each columns as column (column.id)}
					<th
						id={column.id}
						style:font-size="16px"
						style:color="white"
						style:width={column.width ?? 'auto'}>{column.label}</th
					>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sortedTableData as data, i}
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
					<td style:font-weight="bold" class="player">
						<span style:font-size="14px">{getPlayerNameById(data.playerId)}</span>
					</td>
					{#each columns as column (column.id)}
						<td style:text-align="center" style:font-size="14px">
							{data[column.id as keyof PlayersStats]}
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
		width: 95%;
		border: none;
		border-spacing: 0;
		background-color: rgb(224, 224, 224);
		letter-spacing: 1px;
		border: 1px solid black;
		border-radius: 10px;
		color: white;
	}

	thead {
		height: 50px;
		tr {
			border: 1px solid deeppink;
		}
	}

	thead tr th:nth-child(1) {
		border-top-left-radius: 9px;
	}

	thead tr th:nth-last-child(1) {
		border-top-right-radius: 9px;
	}

	tbody tr:nth-last-child(1) td:nth-last-child(1) {
		border-bottom-right-radius: 9px;
	}

	tbody tr:nth-last-child(1) td:nth-child(1) {
		border-bottom-left-radius: 9px;
	}

	th {
		border-bottom: 1px solid black;
	}

	tbody tr td {
		padding: 30px 1px;
		color: black;
	}

	tbody td {
		background-color: white;
		border-bottom: 1px solid black;
	}

	.dark-background {
		background-color: var(--intense-red);
		border-radius: 10px;
	}

	.player {
		margin-left: 5px;
	}
</style>
