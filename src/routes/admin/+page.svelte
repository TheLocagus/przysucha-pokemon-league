<script lang="ts">
	let actionActive = $state('');

	const forms = $state({
		CREATE_TOURNAMENT: {
			count: 0,
			date: new Date().toLocaleDateString()
		}
	});

	const createTournament = async () => {
		const res = await fetch('/api/tournaments', {
			method: 'POST',
			body: JSON.stringify({
				count: forms.CREATE_TOURNAMENT.count,
				date: forms.CREATE_TOURNAMENT.date
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log(res);
	};
</script>

<div class="actions">
	<button onclick={() => (actionActive = 'CREATE_TOURNAMENT')}>Stwórz nowy turniej</button>
	<button>Usuń turniej</button>
	<button>Dodaj rezultat</button>
</div>

{#if actionActive === 'CREATE_TOURNAMENT'}
	<form>
		<label for="date">Data</label>
		<input id="date" type="text" bind:value={forms.CREATE_TOURNAMENT.date} />
		<label for="count">Numer turnieju</label>
		<input id="count" type="number" bind:value={forms.CREATE_TOURNAMENT.count} />
		<button onclick={async () => await createTournament()}>Potwierdź</button>
	</form>
{/if}
