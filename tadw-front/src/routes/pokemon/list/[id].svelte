<script context="module">
	export async function load({ fetch, params }) {
		const url = `http://localhost:5000/pokemon?owner=${params.id}`;
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

	$: owner = $currentUser?.uid;

	const fetchData = async () => {
		const url = `http://localhost:5000/pokemon?owner=${owner}`;
		const response = await fetch(url);
		const result = await response.json();
		pokemons = result.data;
	};

	pokeNumber.set(nextId);
</script>

<h1 class="text-2xl font-medium text-gray-500 mb-4">All Pokemon</h1>

{#if pokemons.length > 0}
	<div class="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
		{#each pokemons as pokemon}
			<PokeCard on:removed={fetchData} {pokemon} />
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
