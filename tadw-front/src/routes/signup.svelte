<script>
	import Alert from '$lib/components/Alert.svelte';
	// import { register } from '$lib/utils/firebase';
	import { users, currentUser } from '$lib/utils/store';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let show = false;
	let variant = '';
	let message = '';

	let isValid = false;

	$: {
		const cond1 = email.length > 0 && email.includes('@');
		const cond2 = password.length > 4;
		const cond3 = confirmPassword.length > 4 && confirmPassword === password;
		const cond4 = name.length > 3;

		isValid = cond1 && cond2 && cond3 && cond4;
	}

	const resetForm = () => {
		name = '';
		email = '';
		password = '';
		confirmPassword = '';
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newUser = {
			name,
			email,
			password
		};
		users.set([...$users, newUser]);
		resetForm();
	};
</script>

<div class="flex flex-col items-center">
	<h1 class="text-3xl text-gray-600 font-medium">Sign up</h1>
	<div
		class="h-max border rounded-lg border-gray-300 px-6 pt-6 py-4 w-full sm:w-3/4
		lg:w-1/2 mt-8 shadow-md"
	>
		<form action="" on:submit={(e) => handleSubmit(e)} autocomplete="off">
			<div class="relative z-0 mt-4 w-full group">
				<input
					bind:value={name}
					minlength="3"
					name="name"
					type="text"
					class="peer input invalid:text-pink-600
					invalid:border-pink-500"
					placeholder="Takuma Mamashiba"
				/>
				<label for="email" class="label peer-invalid:text-pink-600">Name</label>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">
					Name must contain at least 3 characters
				</p>
			</div>
			<div class="relative z-0 mt-4 w-full group">
				<input
					bind:value={email}
					name="email"
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
			<div class="relative z-0 mt-4 w-full group">
				<input
					bind:value={confirmPassword}
					name="confirm-password"
					id="confirm-password"
					type="password"
					class="peer input invalid:text-pink-600 invalid:border-pink-500"
					placeholder="••••••••"
					minlength="5"
				/>
				<p class="invisible peer-invalid:visible text-pink-600 text-right">
					Insert at least 5 characters
				</p>
				<label for="confirm-password" class="label peer-invalid:text-pink-600"
					>Confirm Password</label
				>
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
				<span class="text-gray-400 font-medium">
					Already have an account? <a
						class="font-medium text-sky-400 hover:text-sky-500"
						href="/signin">Sign in</a>
				</span>
			</div>
		</form>
	</div>
	<Alert {show} closeModal={() => (show = false)} {variant} {message} />
</div>
