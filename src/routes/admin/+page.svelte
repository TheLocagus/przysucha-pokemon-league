<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import Options from '../../components/Options.svelte';
	import type { PlayersDTO, TournamentDTO } from '../../utils/data';
	import { notifications } from '../utils/utils';

	let actionActive = $state('');

	const forms = $state({
		CREATE_TOURNAMENT: {
			count: 0,
			date: new Date().toLocaleDateString(),
			players: ['']
		},
		REMOVE_TOURNAMENT: {
			tournamentsIds: ['']
		}
	});

	const players: Readable<PlayersDTO[]> = $state(getContext('playersContext'));
	let tournaments: Writable<TournamentDTO[]> = $state(getContext('tournamentsContext'));

	let confirmedRemove = $state(false);

	const removeTournamentOptionList = $derived(
		$tournaments
			.filter((tournament) => tournament.status === 'in-progress')
			.map((t) => ({
				value: t._id,
				label: t.tournamentCount.toString()
			}))
	);

	const createTournament = async () => {
		const res = await fetch('/api/tournaments', {
			method: 'POST',
			body: JSON.stringify({
				count: forms.CREATE_TOURNAMENT.count,
				date: forms.CREATE_TOURNAMENT.date,
				players: forms.CREATE_TOURNAMENT.players
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (res.status === 200) {
			notifications.update((value) => [
				...value,
				{
					isPositive: true,
					message: 'Turniej został dodany pomyślnie'
				}
			]);

			fetch('/api/tournaments').then(async (res) => {
				const data = await res.json();
				tournaments.set(data);
			});
		}

		console.log(res);
	};

	const removeTournament = async () => {
		if (!confirmedRemove) {
			confirmedRemove = true;
		} else {
			const res = await fetch('/api/tournaments', {
				method: 'DELETE',
				body: JSON.stringify({
					ids: forms.REMOVE_TOURNAMENT.tournamentsIds
				}),
				headers: {
					'content-type': 'application/json'
				}
			});

			if (res.status === 200) {
				notifications.update((value) => [
					...value,
					{
						isPositive: true,
						message: 'Usunięto pomyślnie'
					}
				]);

				fetch('/api/tournaments').then(async (res) => {
					const data = await res.json();
					tournaments.set(data);
				});

				confirmedRemove = false;
			}

			console.log(res);
		}
	};

	$effect(() => {
		if (actionActive) {
			confirmedRemove = false;
		}
	});
</script>

<div class="actions">
	<button onclick={() => (actionActive = 'CREATE_TOURNAMENT')}>Stwórz nowy turniej</button>
	<button onclick={() => (actionActive = 'REMOVE_TOURNAMENT')}>Usuń turniej</button>
	<button>Dodaj rezultat</button>
</div>

{#if actionActive === 'CREATE_TOURNAMENT'}
	<form>
		<label for="date">Data</label>
		<input id="date" type="text" bind:value={forms.CREATE_TOURNAMENT.date} />
		<label for="count">Numer turnieju</label>
		<input id="count" type="number" bind:value={forms.CREATE_TOURNAMENT.count} />
		<Options
			id="players-options"
			optionList={$players.map((player) => ({
				value: player._id,
				label: player.name
			}))}
			selectOptions={(playersIds: string[]) => {
				forms.CREATE_TOURNAMENT.players = playersIds;
			}}
		/>

		<button onclick={async () => await createTournament()}>Potwierdź</button>
	</form>
{:else if actionActive === 'REMOVE_TOURNAMENT'}
	<form>
		<Options
			id="remove-tournaments"
			optionList={removeTournamentOptionList}
			selectOptions={(tournamentsIds) => {
				forms.REMOVE_TOURNAMENT.tournamentsIds = tournamentsIds;
			}}
		/>
		<button
			style:background-color={confirmedRemove ? 'red' : 'white'}
			onclick={() => removeTournament()}
			>{confirmedRemove ? 'NA PEWNO?' : 'Potwierdź usunięcie turnieju'}</button
		>
	</form>
{/if}
