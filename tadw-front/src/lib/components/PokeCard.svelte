<script>
	import { goto } from '$app/navigation';

	import { currentUser } from '$lib/utils/store';
	export let name;
	export let owner;
	export let number;
	export let level;
	export let types;

	const handleDelete = (id) => {
		const response = confirm('Are you sure you want to delete this pokemon?');
		if (response) {
			fetch(`http://localhost:5000/delete/${id}`, { method: 'delete' })
				.then((res) => res.json())
				.then((r) => console.log(r))
				.catch((error) => console.log(error))
				.finally(() => goto('/pokemon/list', { replaceState: true }));
		}
	};
</script>

<div
	class="flex flex-col relative rounded shadow hover:shadow-lg px-4 border py-2
  border-gray-200 w-72"
>
	{#if $currentUser && owner === $currentUser.email}
		<div class="absolute flex right-4 top-2 items-center justify-end gap-2">
			<button
				class="text-sm rounded px-2 bg-gradient-to-r text-gray-50 cursor-pointer
      from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 transition-all"
			>
				Edit
			</button>
			<button
				on:click={() => handleDelete(number)}
				class="text-sm rounded px-2 bg-gradient-to-r text-gray-50 cursor-pointer
        from-red-400 to-pink-500 hover:from-pink-500 hover:to-red-400 transition-all"
			>
				Delete
			</button>
		</div>
	{/if}
	<h1 class="text-xl text-gray-600 font-medium">{name}</h1>
	<div class="flex items-center justify-between">
		<p class="text-gray-500 my-4">Level: {level}</p>
		<div class="flex items-center gap-2">
			{#each types as type}
				<span class="text-sm text-emerald-400 font-medium">{type}</span>
			{/each}
		</div>
	</div>
	<span class="absolute bottom-1 right-4 text-right text-gray-600">
		<span class="font-bold"> Trainer:</span>
		{owner}
	</span>
</div>
