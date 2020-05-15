<style>
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

	.post-header-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		margin-top: 10px;
	}

	.post-title {
		margin: 0;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 24px;
		color: #404040;
	}

	.post-date {
		font-family: 'Nanum Myeongjo', serif;
		font-size: 16px;
		color: #727272;
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
	import axios from 'axios';
	import dayjs from 'dayjs';
	import { link } from 'svelte-spa-router';

	import Error from './Error';

	let posts = undefined;

	(async () => {
		const token = sessionStorage.getItem('api-token');

		try {
			const result = await axios.get(
				'https://api.blog.ashrimp.dev/posts',
				{
					headers: token && {
						'Api-Token': token,
					},
				}
			);

			posts = result.data;
		} catch {
			posts = [];
		}
	})();
</script>

{#if posts}
	{#if posts.length}
		{#each posts as post}
			<a class="post-link" href="{`/${post.slug}`}" use:link>
				<article class="post">
					<span class="post-category" class:exists="{post.category}">
						{post.category ? post.category.name : ''}
					</span>
					<div class="post-header-container">
						<h1 class="post-title">{post.title}</h1>
						<span class="post-date">
							{dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
						</span>
					</div>
					<p class="post-content">{post.contentPreview}</p>
				</article>
			</a>
		{/each}
	{:else}
		<Error message="No post yet!" />
	{/if}
{:else if posts === null}
	<Error message="Post not found!" />
{/if}
