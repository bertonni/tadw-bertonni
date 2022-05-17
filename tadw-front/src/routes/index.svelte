<script>
	import { currentUser } from '$lib/utils/store';
	import { signInWithPopup } from 'firebase/auth';
	import { auth, provider } from '$lib/utils/firebase';

	const signInWithGoogle = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				currentUser.set(result.user);
			})
			.catch((error) => console.log('error', error));
	};
</script>

<h1 class="text-2xl font-medium text-gray-500 text-center">Welcome to SvelteKit Pokemon</h1>

<div class="flex justify-center mt-20">
	{#if !$currentUser}
		<button
			class="rounded bg-gradient-to-r from-sky-400 to-blue-400 px-6 py-2 text-gray-50
				font-medium hover:from-blue-500 hover:to-sky-500 transition-all"
			on:click={signInWithGoogle}>Sign in</button>
	{:else}
		<a
			class="rounded bg-gradient-to-r from-green-400 to-emerald-400 px-6 py-2 text-gray-50
		font-medium hover:from-emerald-500 hover:to-green-500 transition-all"
			href="/pokemon/create"
		>
			Add Pokemon
		</a>
	{/if}
</div>
