<script lang="ts">
	import type { DeckDTO } from '$types';
	import type TCGdex from '@tcgdex/sdk';
	import { getContext } from 'svelte';
	import PreviousIcon from 'svelte-material-icons/ArrowLeftBoldBox.svelte';
	import NextIcon from 'svelte-material-icons/ArrowRightBoldBox.svelte';

	interface $Props {
		decks: DeckDTO[];
	}

	let { decks }: $Props = $props();
	const tcgdex: TCGdex = getContext('tcgdex');

	let chosenDeck: DeckDTO | undefined = $state();
	let chosenCard: string = $state('');

	const getSingleImage = async (cardId: string, q: 'low' | 'high' = 'low') => {
		const card = await tcgdex.card.get(cardId);

		return card?.getImageURL(q, 'png');
	};

	const getPrevCard = (cardId: string) => {
		if (!chosenDeck) return;

		const cards = Object.keys(chosenDeck.cards);
		const actualIndex = cards.findIndex((c) => c === cardId);

		if (actualIndex === -1) return;
		if (actualIndex === 0) return cards[cards.length - 1];
		return cards[actualIndex - 1];
	};

	const getNextCard = (cardId: string) => {
		if (!chosenDeck) return;

		const cards = Object.keys(chosenDeck.cards);
		const actualIndex = cards.findIndex((c) => c === cardId);

		if (actualIndex === -1) return;
		if (actualIndex === cards.length - 1) return cards[0];
		return cards[actualIndex + 1];
	};
</script>

<svelte:body
	onkeydown={(e) => {
		if (chosenCard && e.key === 'Escape') {
			chosenCard = '';
		}

		if (chosenCard && e.key === 'ArrowLeft') {
			chosenCard = getPrevCard(chosenCard) ?? '';
		}

		if (chosenCard && e.key === 'ArrowRight') {
			chosenCard = getNextCard(chosenCard) ?? '';
		}
	}}
/>

{#if chosenCard}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="galery-view-wrapper" onclick={() => (chosenCard = '')}>
		<div class="content">
			{#await getSingleImage(chosenCard, 'high') then imageUrl}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<span
					onclick={(e) => {
						e.stopPropagation();
						chosenCard = getPrevCard(chosenCard) ?? '';
					}}
				>
					<PreviousIcon size={100} />
				</span>
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={imageUrl}
					alt={chosenDeck?.cards[chosenCard].name}
					onclick={(e) => e.stopPropagation()}
				/>
				<span
					onclick={(e) => {
						e.stopPropagation();
						chosenCard = getNextCard(chosenCard) ?? '';
					}}
				>
					<NextIcon size={100} />
				</span>
			{/await}
		</div>
	</div>
{/if}

<div class="decks">
	<div class="deck-buttons">
		{#each decks as deck (deck._id)}
			<button
				onclick={() => {
					if (chosenDeck?._id === deck._id) {
						chosenDeck = undefined;
					} else {
						chosenDeck = deck;
					}
				}}
				class:active={chosenDeck?._id === deck._id}>{deck.name}</button
			>
		{/each}
	</div>
	{#if chosenDeck}
		<div class="deck-details">
			{#each Object.entries(chosenDeck.cards) as [cardId, card] (cardId)}
				<div class="card">
					<span>{card.count}</span>
					{#await getSingleImage(cardId) then imageUrl}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<img
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
			{/each}
		</div>
	{/if}
</div>

<style>
	.deck-buttons {
		display: flex;
		padding: 0 100px;
		gap: 10px;
		background-color: var(--c1);
	}

	button {
		margin: 10px 0;
		padding: 8px 20px;
		font-size: 1.5em;
		background-color: var(--c3);
		border: 1px solid var(--c4);
		border-radius: 8px;
		outline: none;
		cursor: pointer;
		transition: 0.2s;
	}

	button.active {
		background-color: var(--c2);
		color: white;
	}

	.deck-details {
		display: flex;
		flex-wrap: wrap;
		margin: 0 24px;
		gap: 20px;
	}

	.card {
		position: relative;

		span {
			position: absolute;
			bottom: 0;
			right: 0;
			background-color: rgba(73, 69, 69, 0.884);
			font-size: 2em;
			padding: 10px;
		}

		img {
			outline: none;
		}
	}

	.galery-view-wrapper {
		box-sizing: border-box;
		height: 100vh;
		width: 100%;
		background-color: #3333337c;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;

		.content {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		img {
			height: 825px;
			width: 600px;
		}
	}
</style>
