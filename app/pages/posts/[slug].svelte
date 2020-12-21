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
		text-align: center;
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
	import { goto, ready, url } from '@sveltech/routify';
	import axios from 'axios';

	import { token } from '../../stores/token';

	import Fallback from '../_fallback';
	import Fontawesome from '../../components/basic/Fontawesome';
	import Post from '../../components/post/Post';

	let post = undefined;
	let apiToken = null;
	let authenticated;
	let deleting = false;
	export let slug;

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
	})().finally($ready);

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
	{:else}
		<title>Post :: devlog</title>
	{/if}
	<link rel="canonical" href="{`https://blog.ashrimp.dev/posts/${slug}`}" />
	{#if post}
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
		<meta property="og:title" content="{post.title}" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="{window.location.href}" />
		<meta property="og:description" content="{post.contentPreview}" />
		<meta property="article:published_time" content="{post.createdAt}" />
		<meta property="article:modified_time" content="{post.modifiedAt}" />
		<meta property="article:author" content="{post.modifiedAt}" />
		{#if post.category}
			<meta property="article:section" content="{post.category.name}" />
		{/if}
		<meta property="profile:username" content="AcrylicShrimp" />
		<meta name="twitter:site" content="@AcrylicShrimp" />
		<meta name="twitter:creator" content="@AcrylicShrimp" />
		{#if post.thumbnail}
			<meta property="og:image" content="{post.thumbnail.url}" />
			<meta property="og:image:url" content="{post.thumbnail.url}" />
			<meta
				property="og:image:secure_url"
				content="{post.thumbnail.url}"
			/>
			<meta property="og:image:alt" content="preview" />
			<meta property="og:image:width" content="{post.thumbnail.width}" />
			<meta
				property="og:image:height"
				content="{post.thumbnail.height}"
			/>
			<meta name="twitter:card" content="summary_large_image" />
		{:else}
			<meta name="twitter:card" content="summary" />
		{/if}
	{:else}
		<meta property="og:title" content="Post" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="{window.location.href}" />
		<meta property="profile:username" content="AcrylicShrimp" />
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:title" content="Post" />
	{/if}
</svelte:head>
{#if post}
	<main>
		{#if authenticated}
			<nav class="menu-container font sans-serif">
				<button
					class="menu-button red"
					on:click="{onClickDelete}"
				><Fontawesome icon="{faTrashAlt}" /></button>
				<a
					class="menu-button"
					href="{$url('/managements/post-editor/:slug', { slug })}"
				><Fontawesome icon="{faEdit}" /></a>
			</nav>
		{/if}
		<article>
			<Post
				accessLevel="{post.accessLevel}"
				category="{post.category?.name}"
				created="{post.createdAt}"
				title="{post.title}"
				content="{post.htmlContent}"
			/>
		</article>
	</main>
{:else if post === null}
	<Fallback message="Post not found!" />
{/if}
