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
			>{match.playerOne.name} ({match.playerOne.score})</span
		>
	</div>
	<div class="separator">-</div>
	<div class="player">
		<span
			class:draw={isDraw}
			class:win={!isDraw && !isPlayerOneWinner}
			class:lose={!isDraw && isPlayerOneWinner}
			>({match.playerTwo.score}) {match.playerTwo.name}</span
		>
	</div>
</div>

<style>
	.match-result {
		margin: 10px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30%;
		font-size: 1.5em;
		flex-grow: 1;
		color: white;
		letter-spacing: 2px;
		font-weight: bold;
		text-shadow:
			2px 0 #000,
			-2px 0 #000,
			0 2px #000,
			0 -2px #000,
			1px 1px #000,
			-1px -1px #000,
			1px -1px #000,
			-1px 1px #000;

		.player {
			height: 130px;
			display: flex;
			align-items: center;
		}
	}

	.separator {
		margin: 0 5px;
	}

	.draw {
		color: rgb(99, 160, 240);
	}

	.win {
		color: rgb(0, 230, 0);
	}

	.lose {
		color: rgb(255, 65, 65);
	}
</style>
