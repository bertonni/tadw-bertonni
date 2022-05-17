<script>
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/utils/store';

	if ($currentUser) goto('/');
</script>

<div class="flex flex-col items-center">
	<h1 class="text-3xl text-gray-600 font-medium">Sign in</h1>

	<!-- {#if !$currentUser}
		<button
		class="mt-6 px-6 py-2 text-white bg-sky-500 w-52 rounded font-medium"
		on:click={signInWithGoogle}>Sign in With Google</button
		>
	{/if} -->
</div>
