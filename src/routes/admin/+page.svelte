<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import Options from '../../components/Options.svelte';
	import { notifications, setNotifications } from '../utils/utils';
	import type { PlayersDTO, TournamentDTO } from '$types';

	let actionActive = $state('');

	const forms = $state({
		CREATE_TOURNAMENT: {
			count: 0,
			date: new Date().toLocaleDateString(),
			players: ['']
		},
		REMOVE_TOURNAMENT: {
			tournamentsIds: ['']
		},
		ADD_RESULT: {
			tournamentId: '',
			playerOne: {
				playerId: '',
				points: 0,
				name: ''
			},
			playerTwo: {
				playerId: '',
				points: 0,
				name: ''
			}
		},
		END_TOURNAMENT: {
			tournamentsIds: ['']
		}
	});

	const players: Readable<PlayersDTO[]> = $state(getContext('playersContext'));
	let tournaments: Writable<TournamentDTO[]> = $state(getContext('tournamentsContext'));

	let confirmedRemove = $state(false);

	const filteredTournamentsOptionList = $derived(
		$tournaments
			.filter((tournament) => tournament.status === 'in-progress')
			.map((t) => ({
				value: t._id,
				label: t.tournamentCount.toString()
			}))
	);

	const playersInChosenTournament = $derived.by(() => {
		if (forms.ADD_RESULT.tournamentId === '') return [];
		const tournament = $tournaments.find(
			(tournament) => tournament._id === forms.ADD_RESULT.tournamentId
		);

		if (!tournament) throw Error('Tournament not found!');

		const playersIds = tournament.players;

		return $players.filter((player) => playersIds?.includes(player._id));
	});

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
			setNotifications('Turniej dodany pomyślnie');

			fetch('/api/tournaments').then(async (res) => {
				const data = await res.json();
				tournaments.set(data);
			});
		} else {
			const message = (await res.json()).message;
			notifications.update((value) => [
				...value,
				{
					isPositive: false,
					message
				}
			]);
		}
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
				setNotifications('Usunięto pomyślnie');

				fetch('/api/tournaments').then(async (res) => {
					const data = await res.json();
					tournaments.set(data);
				});

				confirmedRemove = false;
			} else {
				const message = (await res.json()).message;
				notifications.update((value) => [
					...value,
					{
						isPositive: false,
						message
					}
				]);
			}

			console.log(res);
		}
	};

	const addResult = async () => {
		console.log(forms.ADD_RESULT);
		const res = await fetch('/api/matches', {
			method: 'POST',
			body: JSON.stringify(forms.ADD_RESULT),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log(res);

		if (res.status === 200) {
			setNotifications('Rezultat dodany pomyślnie');
		} else {
			const message = (await res.json()).message;
			notifications.update((value) => [
				...value,
				{
					isPositive: false,
					message
				}
			]);
		}
	};

	const endTournament = async () => {
		const res = await fetch('/api/tournaments', {
			method: 'PUT',
			body: JSON.stringify(forms.END_TOURNAMENT),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (res.status === 200) {
			setNotifications('Ceremonia zamknięcia przebiegła pomyślnie');

			fetch('/api/tournaments').then(async (res) => {
				const data = await res.json();
				tournaments.set(data);
			});
		} else {
			const message = (await res.json()).message;
			notifications.update((value) => [
				...value,
				{
					isPositive: false,
					message
				}
			]);
		}
	};

	const playersStatsTest = async () => {
		const res = await fetch('/api/utils/playersStats');
		console.log('scores: ', await res.json());
	};

	const playersMatchHistoryTest = async () => {
		const res = await fetch('/api/utils/playersMatchHistory/681f93f4559618353cb8a06b');
		console.log('match history: ', await res.json());
	};

	const tournamentMatchHistoryTest = async () => {
		const res = await fetch('/api/utils/tournamentsMatchHistory/682ce0a026a63bbd4e57d99c');
		console.log('match history: ', await res.json());
	};

	const tournamentsStatsTest = async () => {
		const res = await fetch('/api/utils/tournamentsStats/682ce0a026a63bbd4e57d99c');
		console.log('tournaments stats: ', await res.json());
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
	<button onclick={() => (actionActive = 'ADD_RESULT')}>Dodaj rezultat</button>
	<button onclick={() => (actionActive = 'END_TOURNAMENT')}>Zakończ turniej</button>
	<button onclick={() => playersStatsTest()}>PlayersStats test</button>
	<button onclick={() => playersMatchHistoryTest()}>PlayersMatchHistory</button>
	<button onclick={() => tournamentMatchHistoryTest()}>tournamentMatchHistoryTest</button>
	<button onclick={() => tournamentsStatsTest()}>tournamentsStatsTest</button>
</div>

<div class="page-wrap">
	{#if actionActive === 'CREATE_TOURNAMENT'}
		<form id="create-tournament-form">
			<label for="date">Data</label>
			<input id="date" type="text" bind:value={forms.CREATE_TOURNAMENT.date} />
			<label for="count">Numer turnieju</label>
			<input id="count" type="number" bind:value={forms.CREATE_TOURNAMENT.count} />
			<Options
				id="players-options"
				value=""
				multiple
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
		<form id="remove-tournament-form">
			<Options
				id="remove-tournaments"
				value=""
				multiple
				optionList={filteredTournamentsOptionList}
				selectOptions={(tournamentsIds) => {
					forms.REMOVE_TOURNAMENT.tournamentsIds = tournamentsIds;
				}}
			/>
			<button
				style:background-color={confirmedRemove ? 'red' : 'white'}
				onclick={() => removeTournament()}>{confirmedRemove ? 'NA PEWNO?' : 'Usuń turniej'}</button
			>
		</form>
	{:else if actionActive === 'ADD_RESULT'}
		<form id="add-result-form">
			<label style="margin: 10px 0" for="tournament-id-options">Turniej</label>
			<Options
				id="tournament-id-options"
				optionList={filteredTournamentsOptionList}
				value={forms.ADD_RESULT.tournamentId}
				selectOptions={(tournamentIdArr) => {
					forms.ADD_RESULT.tournamentId = tournamentIdArr[0];
				}}
			/>
			{#if forms.ADD_RESULT.tournamentId}
				<div class="players-section">
					<div class="player-one">
						<label for="add-result-one">Gracz 1</label>
						<Options
							id="add-result-one"
							value={forms.ADD_RESULT.playerOne.playerId}
							optionList={playersInChosenTournament
								.filter((pl) => pl._id !== forms.ADD_RESULT.playerTwo.playerId)
								.map((player) => ({
									label: player.name,
									value: player._id
								}))}
							selectOptions={(playerId) => {
								const playerName =
									playersInChosenTournament.find((list) => list._id === playerId[0])?.name ?? '';
								forms.ADD_RESULT.playerOne.playerId = playerId[0];
								forms.ADD_RESULT.playerOne.name = playerName;
							}}
						/>
						<label style:margin="20px 0 0 0" for="player-one-points">Punkty</label>
						<input
							id="player-one-points"
							type="number"
							min="0"
							max="6"
							bind:value={forms.ADD_RESULT.playerOne.points}
						/>
					</div>
					<div class="separator">VS</div>
					<div class="player-two">
						<label for="add-result-two">Gracz 2</label>
						<Options
							id="add-result-two"
							value={forms.ADD_RESULT.playerTwo.playerId}
							optionList={playersInChosenTournament
								.filter((pl) => pl._id !== forms.ADD_RESULT.playerOne.playerId)
								.map((player) => ({
									label: player.name,
									value: player._id
								}))}
							selectOptions={(playerId) => {
								const playerName =
									playersInChosenTournament.find((list) => list._id === playerId[0])?.name ?? '';
								forms.ADD_RESULT.playerTwo.playerId = playerId[0];
								forms.ADD_RESULT.playerTwo.name = playerName;
							}}
						/>
						<label style:margin="20px 0 0 0" for="player-two-points">Punkty</label>
						<input
							id="player-two-points"
							type="number"
							min="0"
							max="6"
							bind:value={forms.ADD_RESULT.playerTwo.points}
						/>
					</div>
				</div>

				<button onclick={() => addResult()}>Dodaj rezultat</button>
			{/if}
		</form>
	{:else if actionActive === 'END_TOURNAMENT'}
		<form id="end-tournament-form">
			<Options
				id="end-tournaments"
				multiple
				optionList={filteredTournamentsOptionList}
				selectOptions={(tournamentsIds) => {
					forms.END_TOURNAMENT.tournamentsIds = tournamentsIds;
				}}
			/>
			<button
				style:background-color={confirmedRemove ? 'red' : 'white'}
				onclick={() => endTournament()}>Zakończ turniej</button
			>
		</form>
	{/if}
</div>

<style>
	#add-result-form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#add-result-form .players-section {
		display: flex;
		margin: 20px 0;
	}

	.players-section .player-one,
	.players-section .player-two {
		display: flex;
		flex-direction: column;
	}

	input {
		width: 100px;
		border-radius: 5px;
		padding: 4px 5px;
		font-size: 1.1em;
		border: 1px solid black;
		outline: none;
	}

	.separator {
		display: flex;
		align-items: center;
		margin: 0 40px;
		font-size: 1.4em;
		font-weight: bold;
	}
</style>
