<script>
	import Alert from "$lib/components/Alert.svelte";
	import { goto } from '$app/navigation';
	import { users, currentUser } from "$lib/utils/store";

	let email = '';
	let password = '';

	let isValid = false;
	let loginError = '';

	$: show = loginError.length > 0;

	$: {
		const cond1 = email.length > 0 && email.includes('@');
		const cond2 = password.length > 4;

		isValid = cond1 && cond2;
	}

	const resetForm = () => {
		email = '';
		password = '';
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		
		const usr = $users.filter((user) => user.email === email && user.password === password);
		loginError = '';
		if (usr.length > 0) {
			currentUser.set(usr[0]);
			resetForm();
			goto('/', { replaceState: true });
		}
		else loginError = 'Invalid credentials';

	};
</script>

<div class="flex flex-col items-center">
	<h1 class="text-3xl text-gray-600 font-medium">Sign in</h1>
	<div
		class="h-max border rounded-lg border-gray-300 px-6 pt-6 py-4 w-full sm:w-3/4
		lg:w-1/2 mt-8 shadow-md"
	>
		<form action="" on:submit={(e) => handleSubmit(e)}>
			<div class="relative z-0 mt-4 w-full group">
				<input
					bind:value={email}
					type="email"
					class="peer input invalid:text-pink-600
					invalid:border-pink-500"
					placeholder="user@domain.com"
				/>
				<label for="email" class="label peer-invalid:text-pink-600">E-mail</label>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">Invalid e-mail</p>
			</div>
			<div class="relative z-0 mt-4 w-full group">
				<input
					bind:value={password}
					name="password"
					id="password"
					type="password"
					minlength="5"
					class="peer input invalid:text-pink-600 invalid:border-pink-500"
					placeholder="••••••••"
				/>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">
					Insert at least 5 characters
				</p>
				<label for="password" class="label peer-invalid:text-pink-600">Password</label>
			</div>
			<div class="z-0 mt-2 w-full group flex justify-center">
				<button
					disabled={!isValid}
					type="submit"
					class="border rounded bg-gradient-to-r from-sky-500 transition-all
					to-blue-500 px-6 py-2 text-white hover:from-blue-500 hover:to-sky-500 w-40
					font-medium focus-within:outline-sky-300 disabled:from-gray-400 disabled:to-slate-400"
				>
					Submit
				</button>
			</div>
			<div class="flex items-center justify-center gap-4 mt-4">
				<a href="/signup" class="text-orange-500 hover:text-orange-600 font-medium">Create an account</a
				>
				<div class="border-l-2 border-gray-400 h-6" />
				<a href="recovery-password" class="text-teal-500 hover:text-teal-600 font-medium"
					>Forgot password</a
				>
			</div>
		</form>
	</div>
	<Alert {show} message={loginError} variant={'error'} closeModal={() => show = false} />
</div>
