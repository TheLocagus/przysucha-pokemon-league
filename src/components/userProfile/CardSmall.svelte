<script lang="ts">
	import type TCGdex from '@tcgdex/sdk';
	import { getContext } from 'svelte';
	import { tcgdex } from '../../tcgdex';
	import { notifications } from '../../routes/utils/utils';

	let {
		card,
		cardId,
		chosenCard = $bindable()
	}: {
		card: any;
		cardId: string;
		chosenCard: string;
	} = $props();

	let imgElem: HTMLImageElement | undefined = $state();

	const getSingleImage = async (cardId: string, q: 'low' | 'high' = 'low') => {
		if (!$tcgdex) {
			notifications.set([
				...$notifications,
				{ isPositive: false, message: 'Unable to connect with TCGDex.' }
			]);
			return;
		}
		const card = await $tcgdex.card.get(cardId);
		return card?.getImageURL(q, 'png');
	};
</script>

<div class="card">
	{#if imgElem?.complete}
		<span>{card.count}</span>
	{/if}
	{#await getSingleImage(cardId) then imageUrl}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<img
			bind:this={imgElem}
			tabindex={0}
			src={imageUrl}
			alt="{card.name} {card.count}"
			onclick={() => (chosenCard = cardId)}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					chosenCard = cardId;
				}
			}}
		/>
	{/await}
</div>
