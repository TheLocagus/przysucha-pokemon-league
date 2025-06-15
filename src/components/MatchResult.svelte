<script lang="ts">
	import type { MatchesDto } from '$types';

	let {
		match
	}: {
		match: MatchesDto;
	} = $props();

	let isDraw = $derived(match.playerOne.score === match.playerTwo.score);
	let isPlayerOneWinner = $derived(match.playerOne.score > match.playerTwo.score);
</script>

<div class="match-result">
	<div class="player">
		<span
			class:draw={isDraw}
			class:win={!isDraw && isPlayerOneWinner}
			class:lose={!isDraw && !isPlayerOneWinner}
			>{match.playerOne.name} {match.playerOne.score}</span
		>
	</div>
	<div class="separator">-</div>
	<div class="player">
		<span
			class:draw={isDraw}
			class:win={!isDraw && !isPlayerOneWinner}
			class:lose={!isDraw && isPlayerOneWinner}>{match.playerTwo.score} {match.playerTwo.name}</span
		>
	</div>
</div>

<style>
	.match-result {
		border: 1px solid black;
		background-color: var(--intense-red);
		margin: 10px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.1em;
		color: white;
		letter-spacing: 2px;
		font-weight: bold;
		width: 28%;
		border-radius: 5px;
		/* text-shadow:
			2px 0 #000,
			-2px 0 #000,
			0 2px #000,
			0 -2px #000,
			1px 1px #000,
			-1px -1px #000,
			1px -1px #000,
			-1px 1px #000; */

		.player {
			display: flex;
			align-items: center;
			padding: 14px 20px;
		}
	}

	.separator {
		margin: 0 5px;
	}
	/* 
	.draw {
		color: rgb(99, 160, 240);
	}

	.win {
		color: rgb(0, 230, 0);
	}

	.lose {
		color: rgb(255, 65, 65);
	} */
</style>
