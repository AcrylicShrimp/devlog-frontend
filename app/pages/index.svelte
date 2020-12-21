<style>
	.search-container {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: stretch;
		margin-bottom: 30px;
	}

	.search-button {
		margin-left: 0.5em;
	}

	.category-container {
		margin-bottom: 40px;
		text-align: center;
	}

	.category-container.all {
		margin-bottom: 12px;
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
		flex-direction: column-reverse;
		align-items: center;
		justify-content: flex-start;
	}

	@media (min-width: 750px) {
		.post-body-container {
			flex-direction: row;
			align-items: flex-start;
			justify-content: flex-start;
		}
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
		border-radius: 8px;
		width: 100%;
		max-width: 500px;
	}

	@media (min-width: 750px) {
		.post-content + .post-thumbnail {
			margin: auto 0;
			margin-left: 20px;
			max-width: 200px;
		}
	}
</style>

<script>
	import {
		faLock,
		faLink,
		faLongArrowAltLeft,
		faLongArrowAltRight,
	} from '@fortawesome/pro-regular-svg-icons';
	import { afterPageLoad, goto, ready, url } from '@sveltech/routify';
	import axios from 'axios';
	import dayjs from 'dayjs';

	import { token } from '../stores/token';

	import Error from '../components/basic/Error';
	import Fontawesome from '../components/basic/Fontawesome';
	import SearchButton from '../components/button/SearchButton';
	import SearchInput from '../components/input/SearchInput';

	let currentQuery = undefined;
	let currentCategoryName = undefined;
	let currentCategory = undefined;
	let categories = undefined;
	let posts = undefined;
	let apiToken = null;

	token.subscribe((token) => {
		currentQuery = undefined;
		currentCategory = undefined;
		categories = undefined;
		posts = undefined;
		apiToken = token;
	});

	Promise.all([updateCategoryList(), updatePostList()]).finally($ready);

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
			currentQuery = undefined;
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
		const query = urlParams.get('query');
		const before = urlParams.get('before');
		const after = urlParams.get('after');
		const category = urlParams.get('category');

		let params = {};

		if (query) params = { query };
		else {
			if (before) params = Object.assign(params, { before });
			if (after) params = Object.assign(params, { after });
			if (category) params = Object.assign(params, { category });
		}

		currentQuery = query ?? '';

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
	<meta name="description" content="AcrylicShrimp's Blog" />
	<meta property="og:title" content="devlog" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{window.location.href}" />
	<meta property="og:description" content="AcrylicShrimp's Blog" />
	<meta property="profile:username" content="AcrylicShrimp" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="devlog" />
</svelte:head>
<nav class="search-container font sans-serif">
	<SearchInput
		placeholder=""
		bind:value="{currentQuery}"
		on:value="{() => $goto($url('/'), currentQuery && { query: currentQuery })}"
	/><span class="search-button"><SearchButton
			on:click="{() => $goto($url('/'), currentQuery && { query: currentQuery })}"
		/></span>
</nav>
<nav class="category-container all font sans-serif">
	<a
		class="category-button"
		class:disabled="{!currentCategoryName}"
		href="{$url('/')}"
	>
		ALL
	</a>
</nav>
{#if categories}
	<nav class="category-container font sans-serif">
		{#each categories as category (category.name)}
			<a
				class="category-button"
				class:disabled="{category.name === currentCategoryName}"
				href="{$url('/', { category: category.name })}"
			>
				{category.name}
			</a>
		{/each}
	</nav>
{/if}
<main>
	<section class="category-info-container">
		{#if currentCategory}
			<h1 class="category-info-name font sans-serif raleway">
				{currentCategory.name}
			</h1>
			<p class="category-info-desc font sans-serif">
				{currentCategory.description}
			</p>
		{:else}
			<h1 class="category-info-name font sans-serif raleway">
				AcrylicShrimp's Blog
			</h1>
			<p class="category-info-desc font sans-serif">
				Welcome, please enjoy!
			</p>
		{/if}
	</section>
	{#if posts}
		{#if posts.posts.length}
			<nav class="page-button-container top">
				{#if posts.hasAfter}
					<a
						class="page-button left"
						href="{$url('/', Object.assign({ after: posts.posts[0].slug }, currentCategoryName ? { category: currentCategoryName } : {}))}"
					>
						<Fontawesome icon="{faLongArrowAltLeft}" />
					</a>
				{/if}
				{#if posts.hasBefore}
					<a
						class="page-button right"
						href="{$url('/', Object.assign({ before: posts.posts[posts.posts.length - 1].slug }, currentCategoryName ? { category: currentCategoryName } : {}))}"
					>
						<Fontawesome icon="{faLongArrowAltRight}" />
					</a>
				{/if}
			</nav>
			{#each posts.posts as post (post.slug)}
				<a
					class="post-link"
					href="{$url('/posts/:slug', { slug: post.slug })}"
				>
					<article class="post">
						<header>
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
							<h2 class="post-title">{post.title}</h2>
						</header>
						<article class="post-body-container">
							{#if post.contentPreview}
								<p class="post-content">
									{post.contentPreview}
								</p>
							{/if}
							{#if post.thumbnail}
								<img
									class="post-thumbnail"
									alt="Thumbnail"
									src="{post.thumbnail.url}"
								/>
							{/if}
						</article>
					</article>
				</a>
			{/each}
			<nav class="page-button-container bottom">
				{#if posts.hasAfter}
					<a
						class="page-button left"
						href="{$url('/', Object.assign({ after: posts.posts[0].slug }, currentCategoryName ? { category: currentCategoryName } : {}))}"
					>
						<Fontawesome icon="{faLongArrowAltLeft}" />
					</a>
				{/if}
				{#if posts.hasBefore}
					<a
						class="page-button right"
						href="{$url('/', Object.assign({ before: posts.posts[posts.posts.length - 1].slug }, currentCategoryName ? { category: currentCategoryName } : {}))}"
					>
						<Fontawesome icon="{faLongArrowAltRight}" />
					</a>
				{/if}
			</nav>
		{:else}
			<Error message="No post yet!" />
		{/if}
	{:else if posts === null}
		<Error message="Unable to load posts!" />
	{/if}
</main>
