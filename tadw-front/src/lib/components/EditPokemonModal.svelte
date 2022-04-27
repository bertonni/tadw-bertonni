<script>
  import PokeBadge from "./PokeBadge.svelte";

	export let owner;
	export let pokemon;
	export let close;
  export let hasUpdated;

	let searchedValue = '';
	let name = pokemon.name;
	let types = pokemon.types;
	let showOptions = false;
	let number = pokemon.number;

	let level = 1;

	let isValid = false;
	let pokemonTypes = [
		'Normal',
		'Fighting',
		'Flying',
		'Poison',
		'Ground',
		'Rock',
		'Bug',
		'Ghost',
		'Steel',
		'Fire',
		'Water',
		'Grass',
		'Electric',
		'Psychic',
		'Ice',
		'Dragon',
		'Dark',
		'Fairy'
	].sort();

	let options = [];

	$: {
		if (searchedValue !== '') {
			options = pokemonTypes.filter((type) =>
				type.toLowerCase().includes(searchedValue.toLowerCase())
			);
		} else {
			options = pokemonTypes;
		}
	}

	$: {
		const cond1 = name.length > 0;
		const cond2 = number > 0;
		const cond3 = level > 0;
		const cond4 = types.length > 0;

		isValid = cond1 && cond2 && cond3 && cond4;
	}

	const resetForm = () => {
		name = '';
		level = 1;
		types = [];
	};

	const handleSubmit = (e) => {
		e.preventDefault();

    console.log('submitted');

		const pokemon = {
			owner,
			name,
			number,
			level,
			types
		};
		const url = 'http://localhost:5000/update';
		fetch(url, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(pokemon)
		})
			.then((res) => {
				res.json();
			})
			.then((result) => {
				hasUpdated(true);
			})
			.catch((error) => console.log(error));
		resetForm();
    close();
	};

	const handleShowOptions = (e) => {
		e.stopPropagation();
		showOptions = !showOptions;
	};

	const addType = (e, type) => {
		e.stopPropagation();
		types = [...types, type];
		if (types.length === 3) {
			showOptions = false;
			return;
		}
	};

	const removeType = (e, type) => {
		e.stopPropagation();
		types = types.filter((typ) => typ !== type);
	};
</script>

<div
	class="bg-black bg-opacity-60 fixed inset-0 flex justify-center z-20"
	on:click={close}
>
	<div
		on:click={(e) => e.stopPropagation()}
		class="rounded bg-white flex flex-col px-4 py-4 max-h-104 w-10/12 max-w-lg mt-10"
	>
		<h1 class="text-2xl font-medium text-gray-500">Edit {pokemon.name}</h1>
		<form action="" on:submit={(e) => handleSubmit(e)}>
			<div class="relative z-0 mt-8 w-full group">
				<input
					bind:value={name}
					type="text"
					class="peer input invalid:text-pink-600
        invalid:border-pink-500"
					placeholder="Name"
					minlength="3"
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Name</label>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">Invalid name</p>
			</div>
			<div class="relative z-0 mt-3 w-full group">
				<input
					bind:value={number}
					type="number"
					class="peer input invalid:text-pink-600 read-only:bg-gray-50
        invalid:border-pink-500 pointer-events-none"
					placeholder="Name"
					min="1"
					readonly
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Number</label>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">
					Number must be greater than 0
				</p>
			</div>
			<div class="relative z-0 mt-3 w-full group">
				<input
					bind:value={level}
					type="number"
					class="peer input invalid:text-pink-600
        invalid:border-pink-500"
					placeholder="Name"
					min="1"
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Level</label>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">
					Level must be greater than 0
				</p>
			</div>
			<div class="relative z-0 mt-3 w-full group">
				<input
					bind:value={searchedValue}
					type="text"
					class="peer input invalid:text-pink-600 invalid:border-pink-500 cursor-default"
					placeholder="Types"
					disabled={types.length === 3}
					on:click={handleShowOptions}
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Select the type (max: 3)</label>
				<div class="flex items-center gap-2 absolute left-2 top-2 bg-white">
					{#each types as type}
						<PokeBadge {type} remove={removeType} />
					{/each}
				</div>
				<div
					class:hide={!showOptions}
					class:show={showOptions}
					class="absolute top-12 left-0 bg-white w-full flex-col rounded border border-gray-500"
				>
					{#each options as type}
						{#if !types.includes(type) || (type
								.toLowerCase()
								.includes(searchedValue) && searchedValue.toLowerCase() !== '')}
							<li
								class="list-none text-gray-600 hover:bg-gray-200 py-1 transition-all pl-2 rounded hover:cursor-pointer"
								class:disabled={types.length === 3}
								on:click={(e) => addType(e, type)}
							>
								{type}
							</li>
						{/if}
					{/each}
				</div>
			</div>
			<div class="z-0 mt-2 w-full group flex justify-center gap-2">
				<button
					disabled={!isValid}
					type="button"
          on:click={close}
					class="border rounded bg-gradient-to-r from-rose-500 transition-all
          to-red-500 px-6 py-2 text-white hover:from-red-500 hover:to-rose-500 w-40
            font-medium focus-within:outline-rose-300 disabled:from-gray-400 disabled:to-slate-400"
				>
					Cancel
				</button>
				<button
					disabled={!isValid}
					type="submit"
					class="border rounded bg-gradient-to-r from-emerald-500 transition-all
          to-green-500 px-6 py-2 text-white hover:from-green-500 hover:to-emerald-500 w-40
            font-medium focus-within:outline-emerald-300 disabled:from-gray-400 disabled:to-slate-400"
				>
					Save
				</button>
			</div>
		</form>
	</div>
</div>
