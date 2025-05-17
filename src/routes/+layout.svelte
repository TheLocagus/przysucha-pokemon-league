<script lang="ts">
	import { page } from '$app/state';
	import { setContext } from 'svelte';
	import KeyboardReturnIcon from 'svelte-material-icons/KeyboardReturn.svelte';
	import ShieldCrownIcon from 'svelte-material-icons/ShieldCrown.svelte';
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
{#if page.url.pathname === '/admin'}
	<a href="/">
		<KeyboardReturnIcon size="30px" />
	</a>
{:else}
	<a href="/admin">
		<ShieldCrownIcon size="30px" />
	</a>
{/if}

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

	a {
		position: absolute;
		top: 2%;
		left: 1%;
	}
</style>
