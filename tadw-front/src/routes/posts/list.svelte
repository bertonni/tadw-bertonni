<script context="module">
  export async function load({ fetch }) {
    const url = `http://localhost:5000/posts`;
    const response = await fetch(url);

    return {
      status: response.status,
      props: {
        posts: response.ok && (await response.json())
      }
    };
  }
</script>

<script>
import PostCard from "$lib/components/PostCard.svelte";

  export let posts;
  $: allPosts = posts.data;
</script>

<h1 class="text-2xl font-medium text-gray-500 mb-4">All Posts</h1>

<div class="flex flex-col gap-3">
  {#each allPosts as post}
    <PostCard author={post.author} title={post.title} content={post.content} postId={post.id} />
  {/each}
</div>