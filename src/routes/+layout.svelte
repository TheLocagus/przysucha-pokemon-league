<script lang="ts">
	let { children } = $props();
</script>

<div class="page-wrapper">
	<div class="background-wrapper"></div>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
	}

	.page-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	.background-wrapper {
		height: 100vh;
		width: 100vw;
		background-image: url('./assets/pokemon.jfif');
		background-repeat: no-repeat;
		background-size: cover;
		opacity: 0.3;
		position: absolute;
		z-index: -1;
	}

	.content {
		width: 80%;
	}
</style>
