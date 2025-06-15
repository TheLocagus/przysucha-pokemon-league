<script lang="ts">
	import type { MatchesDto } from '$types';
	import { onMount } from 'svelte';
	import MatchResult from './MatchResult.svelte';

	let {
		tournamentId
	}: {
		tournamentId: string;
	} = $props();

	let matches: MatchesDto[] | undefined = $state();

	$effect(() => {
		fetch(`/api/matches/${tournamentId}`).then((res) => {
			res.json().then((data) => {
				matches = data;
			});
		});
	});
</script>

<div class="tournament-details">
	<div class="title">PRZEBIEG TURNIEJU</div>
	<div class="content">
		{#if matches}
			{#each matches as match, i}
				<MatchResult {match} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.tournament-details {
		margin-top: 100px;
	}

	.title {
		box-sizing: border-box;
		width: 100%;
		background-color: #7a0000;
		color: white;
		padding: 30px 0;
		font-size: 1.4em;
		text-align: center;
		font-weight: bold;
		border: 1px solid black;
		letter-spacing: 3px;
	}

	.content {
		margin: 0 20px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>
