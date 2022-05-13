<script>
	import AddNewTypeModal from '$lib/components/AddNewTypeModal.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import PokeBadge from '$lib/components/PokeBadge.svelte';
	import { currentUser, pokeNumber } from '$lib/utils/store';
	import { allTypes } from '$lib/utils/types';

	let searchedValue = '';
	let name = '';
	let types = [];
	let showOptions = false;
	let number;

	$: number = parseInt($pokeNumber);
	let level = 1;
	let success = false;
	let isValid = false;
	let showAddTypeModal = false;

	let pokemonTypes = allTypes.sort();

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
		number = parseInt($pokeNumber);
		level = 1;
		types = [];
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const pokemon = {
			owner: $currentUser.email,
			name,
			number,
			level,
			types
		};
		const url = 'http://localhost:5000/create';
		fetch(url, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(pokemon)
		})
			.then((res) => {
				res.json();
			})
			.then((result) => {
				success = true;
				pokeNumber.set($pokeNumber + 1);
			})
			.catch((error) => console.log(error));
		resetForm();
	};

	const handleShowOptions = (e) => {
		e.stopPropagation();
		showOptions = !showOptions;
		console.log('clicou');
	};

	const addType = (e, type) => {
		e.stopPropagation();
		types = [...types, type];
		if (types.length === 3) {
			showOptions = false;
			return;
		}
	};

	const showAddNewTypeModal = () => {
		showAddTypeModal = true;
	};

	const closeAddNewTypeModal = () => {
		showAddTypeModal = false;
	};

	const removeType = (e, category, type) => {
		e.stopPropagation();
		types = types.filter((typ) => typ !== type);
	};

	const editType = (e, type) => {
		e.stopPropagation();
		console.log('edit', type);
	};

	const deleteType = (e, type) => {
		e.stopPropagation();
		console.log('delete', type);
	};
</script>

<div on:click={() => (showOptions = false)}>
	<h1 class="text-2xl font-medium text-gray-500">Add Pokemon</h1>

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
		<div class="relative z-0 mt-3 w-full">
			<input
				bind:value={searchedValue}
				type="text"
				class="peer input invalid:text-pink-600 invalid:border-pink-500 cursor-default"
				placeholder="Types"
				disabled={types.length === 3}
				on:click={handleShowOptions}
			/>
			<label for="title" class="label peer-invalid:text-pink-600"> Select the type (max: 3) </label>
			<div class="flex items-center gap-2 absolute left-2 top-2 bg-white">
				{#each types as type}
					<PokeBadge {type} category="" remove={removeType} />
				{/each}
			</div>
			<div
				class:hide={!showOptions}
				class:show={showOptions}
				class="absolute top-12 left-0 bg-white w-full flex-col rounded border
					border-gray-500"
			>
				<li
					class="list-none text-gray-50 hover:bg-sky-300 py-1 transition-all pl-2
						rounded-t hover:cursor-pointer bg-sky-400"
					on:click={() => showAddNewTypeModal()}
				>
					Adicionar Novo Tipo
				</li>
				{#each options as type}
					{#if !types.includes(type) || (type
							.toLowerCase()
							.includes(searchedValue) && searchedValue.toLowerCase() !== '')}
						<div
							class="flex items-center w-full hover:bg-gray-200 py-1
								transition-all pl-2"
						>
							<div
								class="flex items-center justify-between text-gray-600 rounded w-full group"
								class:disabled={types.length === 3}
								on:click={(e) => addType(e, type)}
							>
								<span> {type} </span>
								<div
									class="items-center text-xs gap-2 pr-2 invisible group-hover:visible"
								>
									<span
										class="z-10 px-2 border border-sky-600 bg-sky-400 text-gray-50
											rounded-full hover:cursor-pointer hover:bg-sky-500"
										on:click={(e) => editType(e, type)}>Edit</span>
									<span
										class="z-10 px-2 border border-rose-600 bg-rose-400 text-gray-50
											rounded-full hover:cursor-pointer hover:bg-rose-500"
										on:click={(e) => deleteType(e, type)}>Delete</span>
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<div class="z-0 mt-2 w-full group flex justify-center">
			<button
				disabled={!isValid}
				type="submit"
				class="border rounded bg-gradient-to-r from-sky-500 transition-all
				to-blue-500 px-6 py-2 text-white hover:from-blue-500 hover:to-sky-500
					w-40 font-medium focus-within:outline-sky-300 disabled:from-gray-400
					disabled:to-slate-400"
			>
				Submit
			</button>
		</div>
	</form>
	{#if showAddTypeModal}
		<AddNewTypeModal close={closeAddNewTypeModal} />
	{/if}
	<div class="flex justify-center items-center mt-6">
		<Alert
			show={success}
			closeModal={() => (success = false)}
			message="Pokemon added successfuly"
			variant="success"
		/>
	</div>
</div>
