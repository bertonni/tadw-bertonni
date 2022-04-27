<script>
	import '../app.css';
	import { currentUser } from '$lib/utils/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let currentPage;
	$: currentPage = $page.url.pathname;

	const signout = () => {
		currentUser.set(null);
		goto('/signin');
	};
	
	let menus = [
		{ name: 'Home', path: '/', isLogged: false },
		{ name: 'List', path: '/pokemon/list/', isLogged: false },
		{ name: 'Add', path: '/pokemon/create', isLogged: true },
		{ name: 'Signin', path: '/signin', isLogged: false }
	];

	const handleEvent = (event) => {
		console.log(event);
	}
</script>

<div class="h-screen w-screen flex flex-col">
	<nav class="h-12 flex items-center gap-2 text-gray-600 justify-between">
		<div class="flex items-center gap-4 pl-6">
			{#each menus as item}
				{#if item.path !== '/signin' || (item.path === '/signin' && !$currentUser)}
					<a
						class="relative py-2 font-medium transform group"
						class:active={currentPage === item.path}
						href={item.name === "List" && $currentUser ? '/pokemon/list/' + $currentUser.email : item.path}
					>
						<span
							class="absolute h-1 bottom-0 border-b-2 border-gray-300 w-0
								left-0 transition-all group-hover:w-full"
						/>
						{item.name}
					</a>
				{/if}
			{/each}
		</div>
		{#if $currentUser}
			<div class="flex items-center pr-6 gap-2">
				<span>Hello, {$currentUser.name}</span>
				<button class="font-medium transition-all" on:click={() => signout()}>Logout</button>
			</div>
		{/if}
	</nav>

	<div class="flex-grow px-6 sm:px-20 lg:px-24 py-4">
		{#if menus.some((item) => item.path === currentPage && item.isLogged && $currentUser)}
			<slot />
		{:else if menus.some((item) => item.path === currentPage && item.isLogged && !$currentUser)}
			<p class="text-2xl text-gray-500">You must sign in to access this page</p>
		{:else}
			<slot />
		{/if}
	</div>
</div>
