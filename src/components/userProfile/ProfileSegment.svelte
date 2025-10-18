<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		content
	}: {
		title: string;
		content: Snippet<[]>;
	} = $props();
</script>

<div id="profile-segment">
	<h2 id="title">{title}</h2>
	{@render content()}
</div>

<style>
	#profile-segment {
		margin-top: 30px;
	}

	#title {
		height: 50px;
		padding-left: 40px;
		display: flex;
		align-items: center;
		color: white;
		letter-spacing: 1px;
		background-color: var(--c4);
	}
</style>
