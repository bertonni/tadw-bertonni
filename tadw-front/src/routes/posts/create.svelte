<script>
	import Alert from '$lib/components/Alert.svelte';
	import { currentUser } from '$lib/utils/store';
	let title = '';
	let content = '';
	let success = false;
	let isValid = false;
	$: {
		const cond1 = title.length > 0;
		const cond2 = content.length > 4;

		isValid = cond1 && cond2;
	}

	const resetForm = () => {
		title = '';
		content = '';
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const post = {
			author: $currentUser.name,
			title,
			content
		};
		const url = 'http://localhost:5000/create';
		fetch(url, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(post)
		})
			.then((res) => res.json())
			.then((result) => success = true)
			.catch((error) => console.log(error));
		resetForm();
	};
</script>

<h1 class="text-2xl font-medium text-gray-500">Create Post</h1>

<form action="" on:submit={(e) => handleSubmit(e)}>
	<div class="relative z-0 mt-8 w-full group">
		<input
			bind:value={title}
			type="text"
			class="peer input invalid:text-pink-600
      invalid:border-pink-500"
			placeholder="Post title"
		/>
		<label for="title" class="label peer-invalid:text-pink-600">Title</label>
		<p class="invisible peer-invalid:visible text-pink-600 text-right">Invalid e-mail</p>
	</div>
	<div class="relative z-0 mt-4 w-full group">
		<textarea
			bind:value={content}
			name="content"
			id="content"
			minlength="5"
			class="peer input invalid:text-pink-600 invalid:border-pink-500 h-28 resize-none py-1"
			placeholder="Enter your ideas here"
		/>
		<p class="invisible peer-invalid:visible text-pink-600 text-right">
			Insert at least 5 characters
		</p>
		<label for="content" class="label peer-invalid:text-pink-600">Content</label>
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
</form>
<div class="flex justify-center items-center mt-6">
  <Alert
    show={success}
    closeModal={() => (success = false)}
    message="Post created successfuly"
    variant="success"
  />
</div>
