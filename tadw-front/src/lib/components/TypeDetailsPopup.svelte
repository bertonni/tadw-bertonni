<script>
	import { types } from '$lib/utils/store';
	export let type;

	let typeDetails = $types.filter((typ) => typ.type === type)[0];

</script>

<div
	class="absolute bg-sky-400 text-gray-100 h-max w-4/5 border rounded z-20 py-2 px-4
    top-20 right-3 transition-all border-sky-700"
>
	<h1 class="text-xl font-medium">Details about {type} type</h1>
	<div class="flex items-center flex-wrap gap-2 mt-2">
		<p class="font-medium">Strong Against:</p>
		{typeDetails.strong_against.length === 0 ? 'None': ''}
		{#each typeDetails.strong_against as strong, i}
			<span>{strong}{i === typeDetails.strong_against.length - 1 ? '' : ', '}</span>
		{/each}
	</div>
	<div class="flex items-center flex-wrap gap-2">
		<p class="font-medium">Weak Against:</p>
		{typeDetails.weak_against.length === 0 ? 'None': ''}
		{#each typeDetails.weak_against as weak, i}
			<span>{weak}{i === typeDetails.weak_against.length - 1 ? '' : ', '}</span>
		{/each}
	</div>
</div>
