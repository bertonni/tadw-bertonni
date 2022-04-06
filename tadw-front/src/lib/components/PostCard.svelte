<script>
import { goto } from '$app/navigation';

	import { currentUser } from '$lib/utils/store';
	export let title;
	export let content;
	export let author;
	export let postId;

	const handleDelete = (id) => {
		const response = confirm('Are you sure you want to delete this post?');
		if (response) {
			fetch(`http://localhost:5000/delete/${id}`, { method: 'delete' })
				.then((res) => res.json())
				.then((r) => console.log(r))
				.catch((error) => console.log(error))
				.finally(() => goto('/posts/list', { replaceState: true }));
		}
	};
</script>

<div
	class="flex flex-col w-full relative rounded shadow hover:shadow-lg px-4 border py-2
  border-gray-200 h-max"
>
	{#if $currentUser && author === $currentUser.name}
		<div class="absolute flex right-4 top-2 items-center justify-end gap-2">
			<button
				class="text-sm rounded px-2 bg-gradient-to-r text-gray-50 cursor-pointer
      from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 transition-all"
			>
				Edit
			</button>
			<button
        on:click={() => handleDelete(postId)}
				class="text-sm rounded px-2 bg-gradient-to-r text-gray-50 cursor-pointer
        from-red-400 to-pink-500 hover:from-pink-500 hover:to-red-400 transition-all"
			>
				Delete
			</button>
		</div>
	{/if}
	<h1 class="text-xl text-gray-600 font-medium">{title}</h1>
	<p class="text-gray-500 my-4">{content}</p>
	<span class="absolute bottom-1 right-4 text-right text-gray-600">
		<span class="font-bold"> Author:</span>
		{author}
	</span>
</div>
