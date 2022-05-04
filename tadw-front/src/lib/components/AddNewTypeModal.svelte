<script>
	import { allTypes } from '$lib/utils/types';
	import PokeBadge from './PokeBadge.svelte';

	export let close;

	let showStrongAgainstOptions = false;
	let showWeakAgainstOptions = false;
	let type = '';
	let strongAgainst = [];
	let weakAgainst = [];

	let isValid;
	let options = allTypes;

	$: {
		const cond1 = type.length > 3;
		isValid = cond1;
	}

  $: {
    console.log(strongAgainst);
    console.log(weakAgainst);
  }

	const resetForm = () => {
		type = '';
		strongAgainst = [];
		weakAgainst = [];
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log('submitted');

		const newType = {
			type,
			strong_against: strongAgainst,
			weak_against: weakAgainst
		};

		const url = 'http://localhost:5000/types/add';
		fetch(url, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(newType)
		})
			.then((res) => {
				res.json();
			})
			.then((result) => {
				console.log(result);
			})
			.catch((error) => console.log(error));
		resetForm();
		close();
	};

	const handleShowStrongAgainstOptions = (e) => {
		e.stopPropagation();
		showStrongAgainstOptions = !showStrongAgainstOptions;
	};

	const handleShowWeakAgainstOptions = (e) => {
		e.stopPropagation();
		showWeakAgainstOptions = !showWeakAgainstOptions;
	};

	const addType = (e, category, type) => {
		e.stopPropagation();

    if (category === 'strong') {
      strongAgainst = [...strongAgainst, type];
      return;
    }

    weakAgainst = [...weakAgainst, type];
	};

  const removeType = (e, category, type) => {
		e.stopPropagation();

    if (category === 'strong') {
      strongAgainst = strongAgainst.filter((typ) => typ !== type);
      return;
    }
    weakAgainst = weakAgainst.filter((typ) => typ !== type);
	};
</script>

<div class="bg-black bg-opacity-60 fixed inset-0 flex justify-center z-20" on:click={close}>
	<div
		on:click={(e) => e.stopPropagation()}
		class="rounded bg-white flex flex-col px-4 py-4 max-h-104 w-10/12 max-w-lg mt-10"
	>
		<h1 class="text-2xl font-medium text-gray-500">Add New Type</h1>
		<form action="#" on:submit={(e) => handleSubmit(e)}>
			<div class="relative z-0 mt-8 w-full group">
				<input
					bind:value={type}
					type="text"
					class="peer input invalid:text-pink-600
        invalid:border-pink-500"
					placeholder="Type"
					minlength="3"
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Type</label>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">
					Type must have at least 3 chars
				</p>
			</div>
			<div class="relative z-0 mt-3 w-full group h-max">
				<input
					type="text"
					class="peer input invalid:text-pink-600 invalid:border-pink-500 cursor-default"
					placeholder="Select"
					on:click={handleShowStrongAgainstOptions}
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Strong Against</label>
				<div class="flex items-center gap-2 absolute left-2 top-2 bg-white flex-wrap">
					{#each strongAgainst as type}
						<PokeBadge {type} category="strong" remove={removeType} />
					{/each}
				</div>
				<div
					class:hide={!showStrongAgainstOptions}
					class:show={showStrongAgainstOptions}
					class="absolute top-12 left-0 bg-white w-full flex-col rounded border
            border-gray-500 z-50"
				>
					{#each options as type}
						{#if !strongAgainst.includes(type) && !weakAgainst.includes(type)}
							<li
								class="list-none text-gray-600 hover:bg-gray-200 py-1 transition-all
                  pl-2 rounded hover:cursor-pointer"
								on:click={(e) => addType(e, 'strong', type)}
							>
								{type}
							</li>
						{/if}
					{/each}
				</div>
			</div>
      <div class="relative mt-8 w-full group">
				<input
					type="text"
					class="peer input invalid:text-pink-600 invalid:border-pink-500 cursor-default"
					placeholder="Select"
					on:click={handleShowWeakAgainstOptions}
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Weak Against</label>
				<div class="flex items-center gap-2 absolute left-2 top-2 bg-white flex-wrap h-max">
					{#each weakAgainst as type}
						<PokeBadge {type} category="weak" remove={removeType} />
					{/each}
				</div>
				<div
					class:hide={!showWeakAgainstOptions}
					class:show={showWeakAgainstOptions}
					class="absolute top-12 left-0 bg-white w-full flex-col rounded border border-gray-500"
				>
					{#each options as type}
						{#if !weakAgainst.includes(type) && !strongAgainst.includes(type)}
							<li
								class="list-none text-gray-600 hover:bg-gray-200 py-1 transition-all pl-2 rounded hover:cursor-pointer"
								on:click={(e) => addType(e, 'weak', type)}
							>
								{type}
							</li>
						{/if}
					{/each}
				</div>
			</div>
			<div class="z-0 mt-2 w-full group flex justify-center gap-2">
				<button
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
