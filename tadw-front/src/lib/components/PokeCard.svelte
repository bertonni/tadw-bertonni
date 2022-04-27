<script>
	import { currentUser } from '$lib/utils/store';
	import { createEventDispatcher } from 'svelte';
	import EditPokemonModal from './EditPokemonModal.svelte';
	import TypeDetailsPopup from './TypeDetailsPopup.svelte';

	const dispatch = createEventDispatcher(); 

	export let pokemon;

	let showEditModal = false;
	let showTypePopup = false;
	let hoveredType = '';

	const handleEdit = () => {
		showEditModal = true;
	};

	const handleDelete = (id) => {
		const response = confirm('Are you sure you want to delete this pokemon?');
		if (response) {
			fetch(`http://localhost:5000/delete/${pokemon.owner}/${id}`, { method: 'DELETE' })
				.then((res) => res.json())
				.then((r) => {
					console.log(r)
				})
				.catch((error) => console.log(error))
				.finally(() => {
					dispatch('removed', {
						'text': 'pokemon deleted'
					});
				})
		}
	};

	const handleUpdate = async () => {
		const url = `http://localhost:5000/pokemon/${pokemon.owner}/${pokemon.number}`;
		const response = await fetch(url);
		const result = await response.json();
		pokemon = result.data;
	}

	const showTypeDetails = (type) => {
		hoveredType = type;
		showTypePopup = true;
	};

	const closeModal = () => {
		showEditModal = false;
	};
</script>

<div
	class="flex flex-col relative rounded shadow hover:shadow-lg px-4 border py-2
  border-gray-200 w-full"
>
	{#if showTypePopup}
		<TypeDetailsPopup type={hoveredType} />
	{/if}
	{#if showEditModal}
		<EditPokemonModal on:update={handleUpdate} owner={pokemon.owner} pokemon={pokemon} close={closeModal} />
	{/if}
	{#if $currentUser && pokemon.owner === $currentUser.email}
		<div class="absolute flex right-4 top-2 items-center justify-end gap-2">
			<button
				on:click={() => handleEdit()}
				class="text-sm rounded px-2 bg-gradient-to-r text-gray-50 cursor-pointer
      from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 transition-all"
			>
				Edit
			</button>
			<button
				on:click={() => handleDelete(pokemon.number)}
				class="text-sm rounded px-2 bg-gradient-to-r text-gray-50 cursor-pointer
        from-red-400 to-pink-500 hover:from-pink-500 hover:to-red-400 transition-all"
			>
				Delete
			</button>
		</div>
	{/if}
	<h1 class="text-xl text-gray-600 font-medium">{pokemon.name}</h1>
	<div class="flex items-center justify-between">
		<p class="text-gray-500 my-4"><span class="font-medium">Level:</span> {pokemon.level}</p>
		<div class="flex items-center gap-2">
			{#each pokemon.types as type}
				<span
					class="text-sm text-emerald-400 font-medium hover:text-emerald-500 cursor-pointer p-2"
					on:mouseenter={() => showTypeDetails(type)}
					on:mouseleave={() => (showTypePopup = false)}>{type}</span>
			{/each}
		</div>
	</div>
	<span class="absolute bottom-1 right-4 text-right text-gray-600">
		<span class="font-bold"> Trainer:</span>
		{pokemon.owner}
	</span>
</div>
