<script lang="ts">
	let {
		playerOne,
		playerTwo
	}: {
		playerOne: {
			name: string;
			score: number;
		};
		playerTwo: {
			name: string;
			score: number;
		};
	} = $props();
</script>

<div class="result">
	<span class="player" style:text-align="right">{playerOne.name} {playerOne.score}</span>
	<span class="separator">-</span>
	<span class="player">{playerTwo.score} {playerTwo.name}</span>
</div>

<style>
	.result {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-top: 10px;
		height: 40px;
		font-size: 20px;
		width: 100%;

		span.player {
			width: 45%;
		}
	}
</style>
