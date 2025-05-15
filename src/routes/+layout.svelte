<script lang="ts">
	import { setContext } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import Toast from '../components/Toast.svelte';

	let { children, data } = $props();

	setContext('playersContext', readable(data.players));
	setContext('tournamentsContext', writable(data.tournaments));
</script>

<div class="page-wrapper">
	<div class="background-wrapper"></div>
	<div class="content">
		{@render children()}
	</div>
</div>

<Toast />

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
		min-height: 100vh;
		background-color: rgba(252, 24, 24, 0.5);
	}
</style>
