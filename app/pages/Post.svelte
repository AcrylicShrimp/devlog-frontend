<style>
	.menu-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		margin-bottom: 25px;
	}

	.menu-button {
		border: none;
		border-radius: 4px;
		padding: 4px;
		width: 60px;
		background-color: transparent;
		font-size: 18px;
		color: #a5a5a5;
		cursor: pointer;
		outline: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: color 0.2s, box-shadow 0.2s;
	}

	.menu-button.red {
		color: #ff8c8c;
	}

	.menu-button:not(:disabled):hover {
		color: #6a6a6a;
		box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.24);
	}

	.menu-button.red:not(:disabled):hover {
		color: #ff2e2e;
	}

	.menu-button + .menu-button {
		margin-left: 15px;
	}
</style>

<script>
	import '../font-awesome/css/all.css';

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
			<button class="menu-button red" on:click="{onClickDelete}">
				<i class="far fa-trash-alt"></i>
			</button>
			<button class="menu-button">
				<i class="far fa-edit"></i>
			</button>
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
