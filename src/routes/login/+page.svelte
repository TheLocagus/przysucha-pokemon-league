<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	let username = $state('');
	let password = $state('');

	const loginUser = async (username: string, password: string) => {
		const res = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({
				username,
				password
			})
		});

		if (res) {
			await invalidateAll();
			goto('/');
		}
	};
</script>

<form>
	<label>
		<input type="text" placeholder="Username" bind:value={username} />
	</label>
	<label>
		<input type="password" placeholder="Password" bind:value={password} />
	</label>
	<button onclick={async () => await loginUser(username, password)}>Sign in</button>
</form>

<style>
	form {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		gap: 10px;
		background-color: black;
		padding: 60px;

		input {
			line-height: 2em;
			outline: none;
			border-radius: 4px;
			border: 1px solid black;
			padding: 0px 4px;
		}
	}
</style>
