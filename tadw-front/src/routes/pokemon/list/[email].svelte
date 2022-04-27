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
	import { pokeNumber, currentUser } from '$lib/utils/store';

	export let pokemons;
	export let nextId;

	let owner;

	$: owner = $currentUser?.email;

	let hasUpdated = (value) => {
		updated = value;
	};
	let hasDeleted = (value) => {
		deleted = value;
	};

	const fetchData = async () => {
		const url = `http://localhost:5000/pokemon?owner=${owner}`;
		const response = await fetch(url);
		const result = await response.json();
		pokemons = result.data;
	};

	pokeNumber.set(nextId);
</script>

<h1 class="text-2xl font-medium text-gray-500 mb-4">All Pokemon</h1>

<div class="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
	{#each pokemons as pokemon}
		<PokeCard on:removed={fetchData} {hasUpdated} {hasDeleted} {pokemon} />
	{/each}
</div>
