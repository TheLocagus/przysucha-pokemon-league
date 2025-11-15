<script lang="ts">
	import SingleResultInProfile from '../../../components/userProfile/SingleResultInProfile.svelte';
	import ArrowLeft from 'svelte-material-icons/ArrowLeftBold.svelte';
	import ArrowRight from 'svelte-material-icons/ArrowRightBold.svelte';
	import type { PlayerProfileDTO, TournamentDTO } from '$types';
	import AddEditDeckModal from '../../../components/AddEditDeckModal.svelte';
	import ProfileSegment from '../../../components/userProfile/ProfileSegment.svelte';
	import DecksDetails from '../../../components/userProfile/DecksDetails.svelte';

	let {
		data
	}: {
		data: {
			player: PlayerProfileDTO;
			tournaments: TournamentDTO[];
		};
	} = $props();

	let open = $state(false);

	const playerData = $derived(data.player);
	const allTournamentsInfo = $derived(data.tournaments);
	const tournamentsNumber = $derived(Object.keys(playerData.tournamentsMatches).length);
	const type = $derived(data.player.player.favouritePokemon.type);

	const getAge = (year: number) => {
		console.log(typeof year);
		return new Date().getFullYear() - year;
	};

	const getTournamentNumber = (tournamentId: string) => {
		return allTournamentsInfo.find((tournament) => tournament._id === tournamentId)
			?.tournamentCount;
	};
</script>

<div class="player-page {type}">
	<div class="general">
		<div class="avatar">
			<div class="img-container"></div>
		</div>
		<div class="data">
			<div class="up">
				<h1>{playerData.player.name}</h1>
				<p>Wiek: {getAge(playerData.player.birthyear)}</p>
				<p>Ulubiony pokemon: {playerData.player.favouritePokemon.name}</p>
			</div>
		</div>
		<!-- <div class="actions">
			<button onclick={() => (open = true)}>Dodaj talię</button>
		</div> -->
	</div>
	<div class="segments">
		<ProfileSegment title="Historia meczów">
			{#snippet content()}
				<div class="tournaments">
					<div class="arrow">
						<ArrowLeft size="40" class={tournamentsNumber <= 3 ? 'disabled' : ''} />
					</div>
					{#each Object.entries(playerData.tournamentsMatches).toReversed() as [tournamentId, matches]}
						<div class="tournament">
							<div class="title">
								<p>Turniej {getTournamentNumber(tournamentId)}</p>
							</div>
							<div class="results">
								{#each matches as match}
									<SingleResultInProfile
										playerOne={match.playerOne._id.toString() === playerData.player._id
											? match.playerOne
											: match.playerTwo}
										playerTwo={match.playerOne._id === playerData.player._id
											? match.playerTwo
											: match.playerOne}
									/>
								{/each}
							</div>
						</div>
					{/each}
					<div class="arrow">
						<ArrowRight size="40" class={tournamentsNumber <= 3 ? 'disabled' : ''} />
					</div>
				</div>
			{/snippet}
		</ProfileSegment>
		<ProfileSegment title="Talie">
			{#snippet content()}
				<DecksDetails decks={playerData.player.decks} />
			{/snippet}
		</ProfileSegment>
	</div>
</div>

{#if open}
	<AddEditDeckModal
		bind:open
		initValues={{
			name: '',
			cards: {}
		}}
	/>
{/if}

<style>
	.tournaments :global(.disabled) {
		color: gray;
		cursor: not-allowed;
	}

	.player-page {
		.tournament {
			background-color: var(--c3);
			.title {
				background-color: var(--c2);
				color: var(--c4);
			}
		}
	}

	.segments {
	}

	.player-page {
		min-height: 100vh;
	}

	.general {
		color: white;
		display: flex;
		height: 300px;
		/* padding: 50px 0; */
		gap: 20px;
		background-image: var(--background-header);
		background-repeat: no-repeat;
		background-size: cover;
	}

	.general .avatar {
		flex-basis: 30%;
		display: flex;
		justify-content: flex-end;
		margin-top: 50px;
	}

	.general .avatar .img-container {
		height: 160px;
		width: 160px;
		border-radius: 50%;
		background-color: #9d9d9d;
	}

	.data {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: 50px;
	}

	.data .up {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.tournaments {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;

		.arrow {
			display: flex;
			align-items: center;
		}
	}

	.tournament {
		box-sizing: border-box;
		height: 350px;
		width: 300px;
		border: 1px solid rgba(0, 0, 0, 0.253);
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
		border: 1px solid black;

		.title {
			color: transparent;
			text-align: center;
			font-weight: bold;
			padding: 10px 0;
			font-size: 24px;
			font-weight: 400;
		}

		.results {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
		}
	}
</style>
