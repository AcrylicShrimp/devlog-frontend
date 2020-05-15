<style>
	.post-header-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.post-category {
		padding-left: 12px;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 18px;
		color: #727272;
		visibility: hidden;
	}

	.post-category.exists {
		visibility: unset;
	}

	.post-date {
		font-family: 'Nanum Myeongjo', serif;
		font-size: 18px;
		color: #727272;
	}

	.post-title {
		margin: 0;
		margin-top: 32px;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 34px;
		font-size: bold;
		color: #404040;
	}

	.post-content-container {
		margin-top: 30px;
	}
</style>

<script>
	import 'font-awesome/css/font-awesome.css';

	import './halflife.css';
	import './Post.css';

	import axios from 'axios';
	import dayjs from 'dayjs';

	import { token } from '../stores/token';

	import Error from './Error';

	let post = undefined;
	let apiToken = null;
	export let params = {};

	token.subscribe((token) => (apiToken = token));

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

			if (err.response.status === 401) token.set(null);
		}
	})();
</script>

{#if post}
	<div class="post-header-container">
		<span class="post-category" class:exists="{post.category}">
			{post.category ? post.category.name : ''}
		</span>
		<span class="post-date">
			{dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
		</span>
	</div>
	<h1 class="post-title">{post.title}</h1>
	<article class="post-content-container">
		{@html post.htmlContent}
	</article>
{:else if post === null}
	<Error message="Post not found!" />
{/if}
