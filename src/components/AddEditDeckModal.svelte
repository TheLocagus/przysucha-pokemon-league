<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import Input from './Input.svelte';
	import TCGdex, { Query, type CardResume } from '@tcgdex/sdk';
	import Loader from './Loader.svelte';
	import DeleteIcon from 'svelte-material-icons/Delete.svelte';
	import type { DeckForm } from '$types';
	import { page } from '$app/state';
	import { setNotifications } from '../routes/utils/utils';

	const tcgdex: TCGdex = getContext('tcgdex');
	const userId = $derived(page.params.slug);
	let {
		open = $bindable()
	}: {
		open: boolean;
	} = $props();

	let searchInput: HTMLInputElement | undefined = $state();
	let allCards: CardResume[] = $state([]);
	let loading = $state(false);
	let searchStr = $state('');
	let filteredCards: CardResume[] = $derived(
		allCards.filter((card) => card.name.toLowerCase().includes(searchStr.toLowerCase()))
	);

	let searchInputPosition = $derived(searchInput?.getBoundingClientRect());

	onMount(async () => {
		try {
			loading = true;
			allCards = await tcgdex.card.list(Query.create().contains('image', 'https'));
		} catch (e) {
		} finally {
			loading = false;
		}
		console.log(allCards[0]);
		localStorage.removeItem('@tcgdex-cache/https://api.tcgdex.net/v2/en/cards');
	});

	const closeModal = () => {
		open = false;
	};

	const formValues: DeckForm = $state({
		name: '',
		cards: {}
	});

	const deckDetails = $derived(Object.entries(formValues.cards));
	const deckLimit = $derived(
		Object.values(formValues.cards).reduce((acc, curr) => {
			return acc + curr.count;
		}, 0)
	);

	const increaseCard = (card: CardResume) => {
		if (!formValues.cards[card.id]) {
			formValues.cards = {
				...formValues.cards,
				[card.id]: {
					name: card.name,
					count: 1
				}
			};
		} else {
			formValues.cards[card.id].count += 1;
		}
	};

	const decreaseCard = (card: CardResume) => {
		if (formValues.cards[card.id].count === 1) {
			delete formValues.cards[card.id];
		} else {
			formValues.cards[card.id].count -= 1;
		}
	};

	const getDeckLimitClass = () => {
		if (deckLimit === 60) return 'ready';
		if (deckLimit < 60) return 'not-ready';
		return 'out-of-limit';
	};

	const handleDeleteCard = (cardId: string) => {
		console.log(cardId);
		delete formValues.cards[cardId];
	};

	const saveDeck = async () => {
		try {
			loading = true;
			const res = await fetch(`/api/player/${userId}/deck`, {
				method: 'POST',
				body: JSON.stringify({
					name: formValues.name,
					cards: formValues.cards
				})
			});

			if (res.status) setNotifications('Zapisano pomyślnie!', true);
		} catch (e: unknown) {
			setNotifications((e as Error).message, false);
		} finally {
			loading = false;
		}
	};
</script>

<dialog {open}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div id="background" onclick={closeModal}></div>
	<div id="modal">
		<Loader {loading} />
		<div id="header">
			<div class="icon">@</div>
			<div class="title">DODAJ DECK</div>
			<button class="close" onclick={closeModal}>X</button>
		</div>
		<div id="content">
			<div class="row">
				<div class="label">Nazwa decku</div>
				<div class="field">
					<Input id="name" bind:value={formValues.name} />
				</div>
			</div>
			<div class="row cards">
				<div class="label">Karty</div>
				<div class="field">
					<Input id="search-cards" bind:value={searchStr} bind:input={searchInput} />

					{#if searchStr.length >= 3}
						<div
							class="option-list"
							style:position="absolute"
							style:top={(searchInputPosition?.y ?? 0) - (searchInputPosition?.height ?? 0)}
							style="width: {searchInputPosition?.width ?? 0}px"
						>
							{#each filteredCards as card}
								{@const savedCard = formValues.cards[card.id]}
								<div class="element">
									<div class="image-part">
										<img height="280px" src="{card.image}/low.png" alt="" />
									</div>
									<div class="others-part">
										<span style:color="white" class="name">{card.name}</span>
										<div class="counter-wrapper">
											<button disabled={!savedCard} onclick={() => decreaseCard(card)}>{'<'}</button
											>
											<p class="counter">{savedCard ? savedCard.count : 0}</p>
											<button disabled={savedCard?.count === 60} onclick={() => increaseCard(card)}
												>{'>'}</button
											>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
					{#if deckDetails.length}
						<div class="summary">
							{#each deckDetails as [cardId, cardDetails] (cardId)}
								<div class="summary-card">
									<span>{cardDetails.name} x{cardDetails.count} </span>
									<span
										role="button"
										onclick={() => {
											handleDeleteCard(cardId);
										}}
										tabindex="0"
										onkeydown={(e) => {
											if (e.key.toLowerCase() === 'enter') {
												handleDeleteCard(cardId);
											}
										}}
									>
										<DeleteIcon class="delete-icon" />
									</span>
								</div>
							{/each}
						</div>
						<div class="total">
							<span>Cards limit: <span class={getDeckLimitClass()}>{deckLimit}/60</span></span>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div id="footer">
			<div>
				<button onclick={saveDeck}>Ok</button>
			</div>
		</div>
	</div>
</dialog>

<style>
	dialog {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		border: none;
		background-color: transparent;
	}

	#background {
		height: 100%;
		width: 100%;
		background-color: #302b2baf;
	}

	#header {
		height: 60px;
		background-color: var(--intense-red);
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;

		.title {
			flex-basis: 85%;
			text-align: center;
			font-weight: bold;
		}

		.close {
			border: none;
			background: transparent;
			cursor: pointer;
			color: white;
		}
	}

	#content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		padding: 0 50px;

		.row:nth-child(1) {
			margin-top: 20px;
		}
		.row {
			display: grid;
			grid-template-columns: 0.3fr 1fr;
			margin: 10px 0;

			.summary {
				display: flex;
				margin-top: 5px;
				flex-wrap: wrap;

				.summary-card {
					display: flex;
					gap: 14px;
					border: 1px solid brown;
					border-radius: 5px;
					background-color: rgb(148, 147, 147);
					color: black;
					padding: 4px 8px;
				}
				:global(.delete-icon) {
					color: black;
					cursor: pointer;
					transition: 0.2s;
				}
				:global(.delete-icon:hover) {
					color: red;
				}
			}

			.total {
				margin-top: 20px;

				span span {
					font-weight: bold;
				}

				.ready {
					color: green;
				}

				.not-ready {
					color: rgb(255, 136, 0);
				}

				.out-of-limit {
					color: red;
				}
			}
		}
	}

	#footer {
		box-sizing: border-box;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 60px;
		background-color: var(--intense-red);
		padding-right: 50px;
		border-bottom-left-radius: 9px;
		border-bottom-right-radius: 9px;

		button {
			padding: 5px 25px;
			border: 1px solid black;
			cursor: pointer;
			transition: 0.2s;
			border-radius: 5px;
		}

		button:hover {
			background-color: black;
			color: white;
			border: 1px solid white;
		}
	}

	#modal {
		display: flex;
		flex-direction: column;
		height: 500px;
		width: 1200px;
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid black;
		background-color: #d9d9d9;
		border-radius: 10px;
		/* overflow: hidden; */
	}

	/* to component */

	.option-list {
		height: 600px;
		overflow-y: scroll;
	}

	.element {
		display: flex;
		background-color: #333;
		padding: 10px 0;
		font-weight: bold;
	}

	.others-part {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;

		.name {
			font-size: 20px;
			letter-spacing: 1px;
		}

		.counter-wrapper {
			flex-grow: 1;
			display: flex;
			align-items: center;
			gap: 30px;
			font-size: 30px;

			.counter {
				background-color: #d9d9d9;
				line-height: 50px;
				width: 50px;
				text-align: center;
				border-radius: 50%;
			}

			button {
				color: white;
				background-color: transparent;
				border: transparent;
				font-size: 30px;
				cursor: pointer;
			}
		}
	}
</style>
