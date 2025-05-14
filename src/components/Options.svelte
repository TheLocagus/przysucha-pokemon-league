<script lang="ts">
	let {
		id,
		optionList,
		addOption
	}: {
		id: string;
		optionList: {
			label: string;
			value: string;
		}[];
		addOption: (options: any) => void;
	} = $props();
</script>

<select
	multiple
	{id}
	onchange={(e) =>
		addOption(
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
