<script>
	export let message;
	export let variant;
	export let show;
	export let closeModal;

	const variantClasses = {
		success: 'bg-green-100 text-green-500 border-green-500',
		error: 'bg-red-100 text-red-500 border-red-500',
		info: 'bg-blue-100 text-blue-500 border-blue-500',
		warning: 'bg-orange-100 text-orange-500 border-orange-500'
	};

	let color = variantClasses[variant];
</script>

{#if show}
	<div
		class={`w-72 ${color} flex flex-col px-4 rounded pt-2 pb-3 relative mt-6
      transform animate-fade-in-b border`}
	>
		<h3 class="capitalize font-medium text-lg">{variant}</h3>
		<p class="mt-3">{message}</p>
		<span
			on:click={closeModal}
			class="absolute right-2 top-1 font-bold cursor-pointer hover:scale-110">&#10005;</span
		>
	</div>
{/if}
