<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import Input from './Input.svelte';
	import TCGdex, { Query, type CardResume } from '@tcgdex/sdk';
	import Loader from './Loader.svelte';
	const tcgdex: TCGdex = getContext('tcgdex');

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

	interface DeckForm {
		name: string;
		deck: Record<
			string,
			{
				name: string;
				count: number;
			}
		>;
	}

	const formValues: DeckForm = $state({
		name: '',
		deck: {}
	});

	const increaseCard = (card: CardResume) => {
		if (!formValues.deck[card.id]) {
			formValues.deck = {
				...formValues.deck,
				[card.id]: {
					name: card.name,
					count: 1
				}
			};
		} else {
			formValues.deck[card.id].count += 1;
		}
	};

	const decreaseCard = (card: CardResume) => {
		if (formValues.deck[card.id].count === 1) {
			delete formValues.deck[card.id];
		} else {
			formValues.deck[card.id].count -= 1;
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
			<div class="row">
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
								{@const savedCard = formValues.deck[card.id]}
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
				</div>
			</div>
		</div>
		<div id="footer">
			<div>
				<button>Ok</button>
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
			display: flex;
			align-items: center;
			height: 40px;
			.label {
				flex-basis: 30%;
			}
			.field {
				flex-grow: 1;
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

		button {
			padding: 5px 25px;
			border: 1px solid black;
			cursor: pointer;
			transition: 0.3s;
			border-radius: 5px;
		}

		button:hover {
			background-color: var(--intense-red);
			color: white;
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
