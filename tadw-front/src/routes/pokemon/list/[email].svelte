<script context="module">
	export async function load({ fetch, params }) {
		const url = `http://localhost:5000/pokemon?owner=${params.email}`;
		const response = await fetch(url);
		const result = await response.json();

		return {
			status: response.status,
			props: {
				pokemons: response.ok && result.data,
				nextId: response.ok && result.nextId + 1
			}
		};
	}
</script>

<script>
	import PokeCard from '$lib/components/PokeCard.svelte';
	import { pokeNumber } from '$lib/utils/store';

	export let pokemons;
	export let nextId;

	let updated = false;
	let deleted = false;

	let hasUpdated = (value) => {
		updated = value;
	};
	let hasDeleted = (value) => {
		deleted = value;
	};

	pokeNumber.set(nextId);
</script>

<h1 class="text-2xl font-medium text-gray-500 mb-4">All Pokemon</h1>

<div class="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
	{#each pokemons as pokemon}
		<PokeCard
			{hasUpdated}
			{hasDeleted}
			{pokemon}
			owner={pokemon.owner}
			name={pokemon.name}
			number={pokemon.number}
			level={pokemon.level}
			pokeTypes={pokemon.types}
		/>
	{/each}
</div>
