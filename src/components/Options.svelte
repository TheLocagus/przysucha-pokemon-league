<script lang="ts">
	let {
		id,
		optionList,
		selectOptions
	}: {
		id: string;
		optionList: {
			label: string;
			value: string;
		}[];
		selectOptions: (selectedOptions: string[]) => void;
	} = $props();
</script>

<select
	multiple
	{id}
	onchange={(e) =>
		selectOptions(
			[...(e.target as HTMLSelectElement).selectedOptions].map((htmlOption) => htmlOption.value)
		)}
>
	{#each optionList as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>

<style>
	select {
		width: 100px;
		height: 120px;
	}
</style>
