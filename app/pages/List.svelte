<style>
	.page-button-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 15px;
	}

	.page-button-container.top {
		margin-bottom: 15px;
	}

	.page-button-container.bottom {
		margin-top: 15px;
	}

	.page-button {
		border: none;
		border-radius: 4px;
		width: 75px;
		background-color: transparent;
		font-size: 26px;
		outline: none;
		cursor: pointer;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: box-shadow 0.2s;
	}

	.page-button:hover {
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.24);
	}

	.page-button.right {
		margin-left: auto;
	}

	.post-link {
		text-decoration: none;
	}

	.post {
		border-radius: 6px;
		padding: 12px 16px;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: box-shadow 0.2s;
	}

	.post-link + .post-link > .post {
		margin-top: 18px;
	}

	.post:hover {
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.32);
	}

	.post-header-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.post-category {
		padding-left: 12px;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 16px;
		color: #727272;
		visibility: hidden;
	}

	.post-category.exists {
		visibility: unset;
	}

	.post-date {
		font-family: 'Nanum Myeongjo', serif;
		font-size: 16px;
		color: #727272;
	}

	.post-title {
		margin: 0;
		margin-top: 20px;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 24px;
		font-size: bold;
		color: #404040;
	}

	.post-content {
		margin: 0;
		margin-top: 24px;
		padding-left: 4px;
		font-family: 'Nanum Gothic', 'Roboto', sans-serif;
		font-size: 16px;
		color: #404040;
	}
</style>

<script>
	import '../font-awesome/css/all.css';

	import axios from 'axios';
	import dayjs from 'dayjs';
	import { link } from 'svelte-spa-router';

	import { token } from '../stores/token';

	import Error from './Error';

	let posts = undefined;
	let apiToken = null;

	token.subscribe((token) => {
		posts = undefined;
		apiToken = token;
		updatePostList();
	});

	async function updatePostList(before, after) {
		let params = {};

		if (before) params = Object.assign(params, { before });
		if (after) params = Object.assign(params, { after });

		try {
			const result = await axios.get(
				'https://api.blog.ashrimp.dev/posts',
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
					params,
				}
			);

			posts = result.data;
		} catch (err) {
			posts = null;

			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set(null);
		}
	}
</script>

{#if posts}
	{#if posts.posts.length}
		<div class="page-button-container top">
			{#if posts.hasAfter}
				<button
					class="page-button left"
					on:click="{() => {
						window.scrollTo(0, 0);
						updatePostList(null, posts.posts[0].slug);
						posts = undefined;
					}}"
				>
					<i class="far fa-long-arrow-alt-left"></i>
				</button>
			{/if}
			{#if posts.hasBefore}
				<button
					class="page-button right"
					on:click="{() => {
						window.scrollTo(0, 0);
						updatePostList(posts.posts[posts.posts.length - 1].slug, null);
						posts = undefined;
					}}"
				>
					<i class="far fa-long-arrow-alt-right"></i>
				</button>
			{/if}
		</div>
		{#each posts.posts as post}
			<a
				class="post-link"
				href="{`/posts/${post.slug}`}"
				target="_self"
				use:link
			>
				<article class="post">
					<div class="post-header-container">
						<span
							class="post-category"
							class:exists="{post.category}"
						>
							{post.category ? post.category.name : ''}
						</span>
						<span class="post-date">
							{dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
						</span>
					</div>
					<h1 class="post-title">{post.title}</h1>
					<p class="post-content">{post.contentPreview}</p>
				</article>
			</a>
		{/each}
		<div class="page-button-container bottom">
			{#if posts.hasAfter}
				<button
					class="page-button left"
					on:click="{() => {
						window.scrollTo(0, 0);
						updatePostList(null, posts.posts[0].slug);
						posts = undefined;
					}}"
				>
					<i class="far fa-long-arrow-alt-left"></i>
				</button>
			{/if}
			{#if posts.hasBefore}
				<button
					class="page-button right"
					on:click="{() => {
						window.scrollTo(0, 0);
						updatePostList(posts.posts[posts.posts.length - 1].slug, null);
						posts = undefined;
					}}"
				>
					<i class="far fa-long-arrow-alt-right"></i>
				</button>
			{/if}
		</div>
	{:else}
		<Error message="No post yet!" />
	{/if}
{:else if posts === null}
	<Error message="Unable to load posts!" />
{/if}
