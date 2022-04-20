<script context="module">
  export async function load({ fetch, params }) {
    console.log(params.email);
    // return;
    const url = `http://localhost:5000/pokemon?owner=${params.email}`;
    const response = await fetch(url);

    console.log(response);

    return {
      status: response.status,
      props: {
        pokemon: response.ok && (await response.json())
      }
    };
  }
</script>

<script>
import PokeCard from "$lib/components/PokeCard.svelte";
  import { currentUser } from "$lib/utils/store";
  export let pokemon;
  $: allPokemon = pokemon.data;
</script>

<h1 class="text-2xl font-medium text-gray-500 mb-4">All Pokemon</h1>

<div class="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  {#each allPokemon as pokemon}
    <PokeCard owner={pokemon.owner} name={pokemon.name} number={pokemon.number} level={pokemon.level} types={pokemon.types} />
  {/each}
</div>