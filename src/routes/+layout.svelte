<script lang="ts">
	import { page } from '$app/state';
	import { setContext } from 'svelte';
	import ShieldCrownIcon from 'svelte-material-icons/ShieldCrown.svelte';
	import { readable, writable } from 'svelte/store';
	import Toast from '../components/Toast.svelte';

	let { children, data } = $props();

	setContext('playersContext', readable(data.players));
	setContext('tournamentsContext', writable(data.tournaments));
</script>

<div class="header">
	<div class="left">
		<a href="/">
			<img src="/logo.png" alt="Pikachu na niedźwiedziu" />
			<span> Przysuska Liga Pokemon </span>
		</a>
	</div>
	<div class="right">
		<a href="/admin">
			<ShieldCrownIcon size="30px" />
		</a>
	</div>
</div>

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
	}

	.background-wrapper {
		height: 100vh;
		width: 100vw;
		background-image: url('./assets/pokemon.jfif');
		background-repeat: no-repeat;
		background-size: cover;
		opacity: 0.3;
		position: fixed;
		top: 0;
		z-index: -1;
	}

	.content {
		width: 80%;
		min-height: 100vh;
		background-color: rgba(252, 24, 24, 0.5);
	}

	.header {
		display: flex;
		justify-content: space-between;
		padding: 0 40px;
		height: 64px;
		background-color: white;
		box-shadow: 0 3px 2px 0 #00000042;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	a {
		display: flex;
		align-items: center;
		gap: 5px;
		color: black;
		text-decoration: none;
		font-weight: bold;
	}

	img {
		height: 50px;
		width: 50px;
		border-radius: 5px;
	}
</style>
