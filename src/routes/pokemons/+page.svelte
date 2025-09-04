<script lang="ts">
	import { getContext } from 'svelte';
	import TCGdex, { Query, type CardList } from '@tcgdex/sdk';

	const tcgdex: TCGdex = getContext('tcgdex');
	let card = $state();
	let list: CardList | undefined = $state();
	const getRandomPokemon = async () => {
		const response = await tcgdex.fetch('sets', 'swsh3');
		return response?.cards;
	};

	// let searchStr = $state('');
</script>

<!-- <div class="header">
	<button
		onclick={async () => {
			list = await getRandomPokemon();
		}}>Get cards</button
	>
</div> -->

<input
	type="text"
	oninput={async (e) => {
		let searchStr = (e.target as HTMLInputElement).value;
		if (searchStr) {
			list = await tcgdex.card.list(new Query().includes('name', searchStr).contains('image', ''));
		} else {
			list = [];
		}
	}}
/>

<!-- {#if card}
	<img src={card.getImageURL('low', 'png')} alt="" />
{/if} -->

{#if list}
	{#each list as card}
		<!-- <img src={card.image + '/low' + '.png'} alt="" /> -->
		<div>{card.name}</div>
	{/each}
{/if}

<style>
	button {
		padding: 5px 10px;
		border-radius: 5px;
		background-color: green;
		color: white;
		font-size: 20px;
		border: 1px solid white;
		cursor: pointer;
	}

	button:hover {
		color: black;
		border: 1px solid black;
	}
</style>
