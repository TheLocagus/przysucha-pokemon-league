<script lang="ts">
	let { id, value = $bindable(), input = $bindable() } = $props();
</script>

<input {id} type="text" bind:value bind:this={input} />

<style>
	input {
		box-sizing: border-box;
		outline: none;
		border: 1px solid black;
		width: 100%;
		height: 26px;
		font-size: 16px;
		padding: 0 10px;
	}
</style>
