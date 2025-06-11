<script lang="ts">
	let {
		id,
		optionList,
		selectOptions,
		multiple = false,
		value
	}: {
		id: string;
		optionList: {
			label: string;
			value: any;
		}[];
		selectOptions: (selectedOptions: any[]) => void;
		multiple?: boolean;
		value?: string;
	} = $props();
</script>

<select
	{multiple}
	{id}
	{value}
	class:multiple
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
	.multiple {
		width: 100px;
		height: 120px;
	}

	select {
		border-radius: 5px;
		padding: 4px 5px;
		font-size: 1.1em;
		outline: none;
		border: 1px solid black;
	}
</style>
