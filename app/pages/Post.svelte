<style>
	.menu-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: 25px;
	}

	.menu-button {
		border: 1px solid #a5a5a5;
		border-radius: 4px;
		padding: 0;
		width: 4em;
		height: 30px;
		background-color: transparent;
		font-size: 18px;
		color: #a5a5a5;
		cursor: pointer;
		outline: none;
		transition: border 0.2s, color 0.2s;
	}

	.menu-button:not(:disabled):hover {
		border: 1px solid #6a6a6a;
		color: #6a6a6a;
	}

	.menu-button:disabled {
		border: 1px solid #dedede;
		color: #dedede;
	}

	.menu-button + .menu-button {
		margin-left: 15px;
	}
</style>

<script>
	import axios from 'axios';
	import { push } from 'svelte-spa-router';

	import { token } from '../stores/token';

	import Error from './Error';
	import Post from '../components/post/Post';

	let post = undefined;
	let apiToken = null;
	let authenticated;
	let deleting = false;
	export let params = {};

	token.subscribe((token) => (authenticated = !!(apiToken = token)));

	(async () => {
		try {
			const result = await axios.get(
				`https://api.blog.ashrimp.dev/posts/${params.slug}`,
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			post = result.data;
		} catch (err) {
			post = null;

			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set(null);
		}
	})();

	async function onClickDelete() {
		if (deleting) return;

		deleting = true;

		try {
			await axios.delete(
				`https://api.blog.ashrimp.dev/admin/posts/${params.slug}`,
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			push('/');
		} catch (err) {
			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set(null);
			else alert('Error occurred.');
		} finally {
			deleting = false;
		}
	}
</script>

{#if post}
	{#if authenticated}
		<div class="menu-container font sans-serif">
			<button class="menu-button" on:click="{onClickDelete}">
				Delete
			</button>
			<button class="menu-button">Edit</button>
		</div>
	{/if}
	<Post
		category="{post.category ? post.category.name : undefined}"
		created="{post.createdAt}"
		title="{post.title}"
		content="{post.htmlContent}"
	/>
{:else if post === null}
	<Error message="Post not found!" />
{/if}
