<script lang="ts">
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
	{#if $notifications[0]?.isPositive}
		<div class="checkmark-wrapper">
			<CheckCircle size="36" color="green" />
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
	{:else}
		<div></div>
	{/if}
{/if}

<style>
	.checkmark-wrapper {
		position: absolute;
		top: 8%;
		right: 3%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: rgb(136, 253, 156);
		gap: 14px;
		padding: 0 5px;
		border: 1px solid rgb(0, 87, 0);
		border-radius: 5px;
		font-size: 0.9em;
	}

	button {
		background-color: rgb(136, 253, 156);
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
