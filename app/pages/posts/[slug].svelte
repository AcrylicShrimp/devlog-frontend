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
	import { faEdit, faTrashAlt } from '@fortawesome/pro-regular-svg-icons';
	import { goto } from '@sveltech/routify';
	import axios from 'axios';

	import { token } from '../../stores/token';

	import Fallback from '../_fallback';
	import Fontawesome from '../../components/basic/Fontawesome';
	import Post from '../../components/post/Post';

	let post = undefined;
	let apiToken = null;
	let authenticated;
	let deleting = false;
	export let slug = {};

	token.subscribe((token) => (authenticated = !!(apiToken = token)));

	(async () => {
		try {
			const result = await axios.get(
				`https://api.blog.ashrimp.dev/posts/${slug}`,
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
				token.set('');
		}
	})();

	async function onClickDelete() {
		if (deleting) return;

		deleting = true;

		try {
			await axios.delete(
				`https://api.blog.ashrimp.dev/admin/posts/${slug}`,
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			$goto('/');
		} catch (err) {
			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set('');
			else alert('Error occurred.');
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	{#if post}
		<title>{post.title} :: devlog</title>
		<meta
			name="description"
			content="{JSON.stringify({
				slug: slug,
				title: post.title,
				content: post.contentPreview,
				'access-level': post.accessLevel,
				'created-at': post.createdAt,
				'modified-at': post.modifiedAt,
			})}"
		/>
		<meta property="og:url" content="{window.location.href}" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content="{post.title} :: devlog" />
		<meta property="og:description" content="{post.contentPreview}" />
		<meta property="twitter:url" content="{window.location.href}" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="{post.title} :: devlog" />
		<meta name="twitter:description" content="{post.contentPreview}" />
	{:else}
		<title>Post :: devlog</title>
		<meta property="og:url" content="{window.location.href}" />
		<meta property="og:type" content="website" />
		<meta property="og:title" content="Post :: devlog" />
		<meta property="twitter:url" content="{window.location.href}" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="Post :: devlog" />
	{/if}
</svelte:head>
{#if post}
	{#if authenticated}
		<div class="menu-container font sans-serif">
			<button
				class="menu-button red"
				on:click="{onClickDelete}"
			><Fontawesome icon="{faTrashAlt}" /></button>
			<button class="menu-button"><Fontawesome icon="{faEdit}" /></button>
		</div>
	{/if}
	<Post
		category="{post.category ? post.category.name : undefined}"
		created="{post.createdAt}"
		title="{post.title}"
		content="{post.htmlContent}"
	/>
{:else if post === null}
	<Fallback message="Post not found!" />
{/if}
