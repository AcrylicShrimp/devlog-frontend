<style>
	.category-container {
		margin-bottom: 40px;
		text-align: center;
	}

	.category-button {
		display: inline-block;
		margin: 6px;
		padding: 6px 0;
		border: none;
		border-radius: 2px;
		background-color: transparent;
		width: 85px;
		font-size: 14px;
		color: #aeaeae;
		cursor: pointer;
		outline: none;
		text-align: center;
		text-decoration: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: color 0.2s, box-shadow 0.2s;
	}

	.category-button:not(.disabled):hover {
		color: #404040;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.24);
	}

	.category-button.disabled {
		cursor: default;
		color: #404040;
	}

	.category-info-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		margin-bottom: 20px;
	}

	.category-info-name {
		margin: 0;
		font-size: 27px;
		font-weight: bold;
	}

	.category-info-desc {
		margin: 0;
		margin-top: 12px;
		font-size: 15px;
	}

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
		color: #aeaeae;
		cursor: pointer;
		outline: none;
		text-align: center;
		text-decoration: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: color 0.2s, box-shadow 0.2s;
	}

	.page-button:not(:disabled):hover {
		color: #404040;
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

	.post:hover {
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.32);
	}

	.post-link + .post-link > .post {
		margin-top: 18px;
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

	.post-icon {
		font-size: 16px;
		color: #727272;
		vertical-align: middle;
	}

	.post-date {
		font-family: 'Nanum Myeongjo', serif;
		font-size: 16px;
		color: #727272;
	}

	.post-body-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.post-title {
		margin: 0;
		margin-top: 20px;
		margin-bottom: 15px;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 24px;
		font-size: bold;
		color: #404040;
	}

	.post-content {
		flex-basis: auto;
		flex-grow: 1;
		flex-shrink: 1;
		margin: 0;
		margin-top: 24px;
		padding-left: 4px;
		font-family: 'Nanum Gothic', 'Roboto', sans-serif;
		font-size: 16px;
		color: #404040;
	}

	.post-thumbnail {
		flex-basis: auto;
		flex-grow: 0;
		flex-shrink: 0;
		margin: auto 0;
		margin-left: 20px;
		border-radius: 8px;
	}
</style>

<script>
	import {
		faLock,
		faLink,
		faLongArrowAltLeft,
		faLongArrowAltRight,
	} from '@fortawesome/pro-regular-svg-icons';
	import { afterPageLoad, ready, url } from '@sveltech/routify';
	import axios from 'axios';
	import dayjs from 'dayjs';

	import { token } from '../stores/token';

	import Error from '../components/basic/Error';
	import Fontawesome from '../components/basic/Fontawesome';

	let currentCategoryName = undefined;
	let currentCategory = undefined;
	let categories = undefined;
	let posts = undefined;
	let apiToken = null;

	token.subscribe((token) => {
		currentCategory = undefined;
		categories = undefined;
		posts = undefined;
		apiToken = token;
	});

	Promise.all([updateCategoryList(), updatePostList()]).then($ready);

	$afterPageLoad(() => {
		window.scrollTo(0, 0);
		updateCategoryList();
		updatePostList();
	});

	async function updateCategoryList() {
		try {
			const result = await axios.get(
				'https://api.blog.ashrimp.dev/categories',
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			categories = result.data;
			setCategory(
				new URLSearchParams(window.location.search).get('category'),
				false
			);
		} catch (err) {
			currentCategoryName = undefined;
			currentCategory = undefined;
			categories = null;

			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set('');
		}
	}

	async function updatePostList() {
		const urlParams = new URLSearchParams(window.location.search);
		const before = urlParams.get('before');
		const after = urlParams.get('after');
		const category = urlParams.get('category');

		let params = {};

		if (before) params = Object.assign(params, { before });
		if (after) params = Object.assign(params, { after });
		if (category) params = Object.assign(params, { category });

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
				token.set('');
		}
	}

	async function setCategory(categoryName, updatePost = true) {
		currentCategoryName = categoryName;
		currentCategory = undefined;

		for (let index = 0; index < categories.length; ++index)
			if (currentCategoryName === categories[index].name) {
				currentCategory = categories[index];
				break;
			}

		if (!currentCategory) currentCategoryName = undefined;

		if (updatePost) updatePostList();
	}
</script>

<svelte:head>
	<title>Posts :: devlog</title>
</svelte:head>
{#if categories}
	<div class="category-container font sans-serif">
		<a
			class="category-button"
			class:disabled="{!currentCategoryName}"
			href="{$url('/')}"
			target="_self"
		>
			ALL
		</a>
		{#each categories as category (category.name)}
			<a
				class="category-button"
				class:disabled="{category.name === currentCategoryName}"
				href="{$url('/', { category: category.name })}"
				target="_self"
			>
				{category.name}
			</a>
		{/each}
	</div>
{/if}
{#if currentCategory}
	<div class="category-info-container">
		<p class="category-info-name font sans-serif raleway">
			{currentCategory.name}
		</p>
		<p class="category-info-desc font sans-serif">
			{currentCategory.description}
		</p>
	</div>
{/if}
{#if posts}
	{#if posts.posts.length}
		<div class="page-button-container top">
			{#if posts.hasAfter}
				<a
					class="page-button left"
					href="{$url('/', { after: posts.posts[0].slug })}"
					target="_self"
				>
					<Fontawesome icon="{faLongArrowAltLeft}" />
				</a>
			{/if}
			{#if posts.hasBefore}
				<a
					class="page-button right"
					href="{$url('/', {
						before: posts.posts[posts.posts.length - 1].slug,
					})}"
					target="_self"
				>
					<Fontawesome icon="{faLongArrowAltRight}" />
				</a>
			{/if}
		</div>
		{#each posts.posts as post (post.slug)}
			<a
				class="post-link"
				href="{$url('/posts/:slug', { slug: post.slug })}"
				target="_self"
			>
				<article class="post">
					<div class="post-header-container">
						<span
							class="post-category"
							class:exists="{post.category}"
						>
							{post.category ? post.category.name : ''}
						</span>
						<span>
							<span class="post-icon">
								{#if post.accessLevel === 'unlisted'}
									<Fontawesome icon="{faLink}" />
								{:else if post.accessLevel === 'private'}
									<Fontawesome icon="{faLock}" />
								{/if}
							</span>
							<span class="post-date">
								{dayjs(post.createdAt).format('YYYY/MM/DD HH:mm')}
							</span>
						</span>
					</div>
					<h1 class="post-title">{post.title}</h1>
					<div class="post-body-container">
						<p class="post-content">{post.contentPreview}</p>
						{#if post.thumbnail}
							<img
								class="post-thumbnail"
								width="200"
								alt="Thumbnail"
								src="{post.thumbnail.url}"
							/>
						{/if}
					</div>
				</article>
			</a>
		{/each}
		<div class="page-button-container bottom">
			{#if posts.hasAfter}
				<a
					class="page-button left"
					href="{$url('/', { after: posts.posts[0].slug })}"
					target="_self"
				>
					<Fontawesome icon="{faLongArrowAltLeft}" />
				</a>
			{/if}
			{#if posts.hasBefore}
				<a
					class="page-button right"
					href="{$url('/', {
						before: posts.posts[posts.posts.length - 1].slug,
					})}"
					target="_self"
				>
					<Fontawesome icon="{faLongArrowAltRight}" />
				</a>
			{/if}
		</div>
	{:else}
		<Error message="No post yet!" />
	{/if}
{:else if posts === null}
	<Error message="Unable to load posts!" />
{/if}
