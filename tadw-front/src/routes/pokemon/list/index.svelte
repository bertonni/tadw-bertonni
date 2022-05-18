<script>
	import PokeCard from '$lib/components/PokeCard.svelte';
	import { pokemons } from '$lib/utils/store';

</script>

<h1 class="text-2xl font-medium text-gray-500 mb-4">All Pokemon</h1>

{#if $pokemons.length > 0}
	<div class="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
		{#each $pokemons as pokemon}
			<PokeCard {pokemon} />
		{/each}
	</div>
{:else}
	<div class="flex flex-col justify-center items-center w-full">
		<p class="text-gray-600 text-lg">It seems you do not have any pokemon!</p>
		<p class="text-gray-600 text-lg">
			Add one <a
				class="text-sky-500 font-medium hover:underline hover:text-sky-600 transition-all"
				href="/pokemon/create">here</a
			>
		</p>
	</div>
{/if}