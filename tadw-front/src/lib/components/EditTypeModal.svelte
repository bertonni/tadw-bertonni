<script>
	// import { allTypes } from '$lib/utils/types';
	import PokeBadge from './PokeBadge.svelte';
	import { allTypesDetailed } from '$lib/utils/store';

	export let selectedType;
	export let close;

	let showStrongAgainstOptions = false;
	let showWeakAgainstOptions = false;
	let type = selectedType.type;

	let isValid;
	let hideWeak = false;
	let options = $allTypesDetailed;
	let strongAgainst = Array.from(selectedType.strong_against);
	let weakAgainst = Array.from(selectedType.weak_against);

	$: {
		const cond1 = type.length > 3;
		const cond2 = selectedType.strong_against.length <= 5;
		const cond3 = selectedType.weak_against.length <= 5;
		isValid = cond1 && cond2 && cond3;
	}

	let weakDivClasses = '';

	$: {
		weakDivClasses = hideWeak ? 'relative mt-8 w-full group -z-10' : 'relative mt-8 w-full group';
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log('submitted');

		const newType = {
			type,
			strong_against: strongAgainst,
			weak_against: weakAgainst
		};

		console.log('updated type', newType);
		const url = 'http://localhost:5000/types/update';

		fetch(url, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(newType)
		})
			.then((res) => {
				res.json();
			})
			.then((result) => {
				console.log('res', result);
			})
			.catch((error) => console.log(error));
		close();
	};

	const handleShowStrongAgainstOptions = (e) => {
		e.stopPropagation();
		showStrongAgainstOptions = !showStrongAgainstOptions;
		showWeakAgainstOptions = false;
		hideWeak = showStrongAgainstOptions;
	};

	const handleShowWeakAgainstOptions = (e) => {
		e.stopPropagation();
		showWeakAgainstOptions = !showWeakAgainstOptions;
		showStrongAgainstOptions = false;
	};

	const addType = (e, category, type) => {
		e.stopPropagation();

		if (category === 'strong' && strongAgainst.length < 5) {
			strongAgainst = [...strongAgainst, type];
			if (strongAgainst.length === 5) showStrongAgainstOptions = false;
		} else {
			if (weakAgainst.length < 5) weakAgainst = [...weakAgainst, type];
			if (weakAgainst.length === 5) showWeakAgainstOptions = false;
		}
	};

	const removeType = (e, category, type) => {
		e.stopPropagation();

		if (category === 'strong') {
			strongAgainst = strongAgainst.filter((typ) => typ !== type);
			return;
		}
		weakAgainst = weakAgainst.filter((typ) => typ !== type);
	};

	const closeOptions = (e) => {
		e.stopPropagation();
		showStrongAgainstOptions = false;
		showWeakAgainstOptions = false;
		hideWeak = false;
	};

	console.log(strongAgainst, weakAgainst)
</script>

<div class="bg-black bg-opacity-60 fixed inset-0 flex justify-center z-20" on:click={close}>
	<div
		on:click={(e) => closeOptions(e)}
		class="rounded bg-white flex flex-col px-4 py-4 max-h-[21rem] w-10/12 max-w-lg mt-10 z-30"
	>
		<h1 class="text-2xl font-medium text-gray-500">Add New Type</h1>
		<form action="#" on:submit={(e) => handleSubmit(e)}>
			<div class="relative z-0 mt-8 w-full group">
				<input
					bind:value={selectedType.type}
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
					disabled={selectedType.strong_against.length === 5}
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Strong Against (max: 5)</label>
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
						{#if !strongAgainst.includes(type.type) && !weakAgainst.includes(type.type)}
							<li
								class="list-none text-gray-600 hover:bg-gray-200 py-1 transition-all
                  pl-2 rounded hover:cursor-pointer"
								on:click={(e) => addType(e, 'strong', type.type)}
							>
								{type.type}
							</li>
						{/if}
					{/each}
				</div>
			</div>
			<div class={weakDivClasses}>
				<input
					type="text"
					class="peer input invalid:text-pink-600 invalid:border-pink-500 cursor-default"
					placeholder="Select"
					on:click={handleShowWeakAgainstOptions}
					disabled={weakAgainst.length === 5}
				/>
				<label for="title" class="label peer-invalid:text-pink-600">Weak Against (max: 5)</label>
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
						{#if !weakAgainst.includes(type.type) && !strongAgainst.includes(type.type)}
							<li
								class="list-none text-gray-600 hover:bg-gray-200 py-1 transition-all pl-2
									rounded hover:cursor-pointer"
								on:click={(e) => addType(e, 'weak', type)}
							>
								{type.type}
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
