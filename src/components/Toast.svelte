<script lang="ts">
	import AlertCircle from 'svelte-material-icons/AlertCircle.svelte';
	import CheckCircle from 'svelte-material-icons/CheckCircle.svelte';
	import { notifications } from '../routes/utils/utils';

	let intervalId: number | undefined = $state();

	$effect(() => {
		if ($notifications.length) {
			intervalId = setTimeout(() => {
				notifications.update((n) => {
					n.shift();
					intervalId = undefined;
					return n;
				});
			}, 5000) as unknown as number;
		}
	});
</script>

{#if $notifications.length}
	<div class="{$notifications[0]?.isPositive ? 'info' : 'error'} checkmark-wrapper">
		{#if $notifications[0]?.isPositive}
			<CheckCircle size="36" color="green" />
		{:else}
			<AlertCircle size="36" color="rgb(130,0,0)" />
		{/if}
		<span>({$notifications.length}) {$notifications[0].message}</span>
		<button
			onclick={() => {
				clearTimeout(intervalId);
				notifications.update((n) => {
					n.shift();
					intervalId = undefined;
					return n;
				});
			}}
			class="close-button">X</button
		>
	</div>
{/if}

<style>
	.checkmark-wrapper {
		position: absolute;
		top: 5%;
		right: 2%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		padding: 0 10px 0 5px;
		border-radius: 5px;
		font-size: 0.9em;
	}

	.info {
		background-color: rgb(136, 253, 156);
		border: 1px solid rgb(0, 87, 0);
	}

	.error {
		background-color: rgb(252, 121, 121);
		border: 1px solid rgb(129, 0, 0);
	}

	button {
		background-color: white;
		border: 1px solid black;
		height: 16px;
		width: 16px;
		outline: none;
		border-radius: 50%;
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(50%, -50%);
		font-size: 0.55em;
		cursor: pointer;
	}
</style>
