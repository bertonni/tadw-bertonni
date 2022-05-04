<script>
	export let type;
	export let remove;
	export let category;
</script>

<div class="flex items-center justify-between rounded-full bg-sky-500 text-white px-2 gap-2">
	<span>{type}</span>
	<span
		class="text-white text-xs font-bold z-50 hover:cursor-pointer"
		on:click={(e) => remove(e, category, type)}>&#10005;</span
	>
</div>
