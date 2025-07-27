<script lang="ts">
	import SingleResultInProfile from '../../../components/userProfile/SingleResultInProfile.svelte';
	import ArrowLeft from 'svelte-material-icons/ArrowLeftBold.svelte';
	import ArrowRight from 'svelte-material-icons/ArrowRightBold.svelte';

	let { data } = $props();

	const playerData = $derived(data.player);
	const allTournamentsInfo = $derived(data.tournaments);
	const tournamentsNumber = $derived(Object.keys(playerData.tournamentsMatches).length);

	const getAge = (year: number) => {
		console.log(typeof year);
		return new Date().getFullYear() - year;
	};

	const getTournamentNumber = (tournamentId: string) => {
		return allTournamentsInfo.find((tournament) => tournament._id === tournamentId)
			?.tournamentCount;
	};
</script>

<div class="player-page">
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
			<div class="down">
				<p>Liczba rozegranych turniejów: {tournamentsNumber}</p>
			</div>
		</div>
	</div>
	<div class="match-history">
		<h2 id="title">Historia meczów</h2>
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

		<!-- <div class="result">
						<MatchHistoryInProfile />
					</div>
					<div class="result">
						<MatchHistoryInProfile />
					</div>
					<div class="result">
						<MatchHistoryInProfile />
					</div>
					<div class="result">
						<MatchHistoryInProfile />
					</div> -->
	</div>
</div>

<style>
	.tournaments :global(.disabled) {
		color: gray;
		cursor: not-allowed;
	}

	.player-page {
		background-image: url('/profile-backgrounds/bulbasaur.png');
		background-position: 400px -300px;
		background-size: 80%;
		min-height: 100vh;
	}

	.general {
		color: white;
		display: flex;
		padding: 50px 0;
		gap: 20px;
	}

	.general .avatar {
		flex-basis: 30%;
		display: flex;
		justify-content: flex-end;
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
	}

	.data .up {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.match-history {
		margin-top: 30px;
	}

	.match-history #title {
		height: 50px;
		padding-left: 40px;
		background-color: #268326ad;
		display: flex;
		align-items: center;
		color: white;
		letter-spacing: 1px;
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
		background-color: rgb(168, 255, 207);
		border: 1px solid black;

		.title {
			color: transparent;
			text-align: center;
			background-color: rgb(25, 167, 60);
			font-weight: bold;
			color: #153b15;
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
