<style>
	.menu-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.menu-tab-container {
		flex: 1 1 auto;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		margin-top: 14.5px;
		border-top: 1px solid #ffca64;
		padding: 0 8px;
	}

	.menu-tab-button {
		border: 0;
		border-radius: 0 0 4px 4px;
		padding: 8px 0;
		width: 5em;
		background-color: transparent;
		font-size: 16px;
		color: #404040;
		cursor: pointer;
		outline: none;
		transition: background-color 0.2s, color 0.2s;
	}

	.menu-tab-button.active {
		background-color: #efefef;
	}

	.menu-tab-button:not(.active):not(:disabled):hover {
		background-color: #e6e6e6;
	}

	.menu-tab-button:disabled {
		color: #c4c4c4;
	}

	.menu-tab-button + .menu-tab-button {
		margin-left: 5px;
	}

	.menu-post {
		margin-left: 20px;
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

	.menu-post:not(:disabled):hover {
		border: 1px solid #6a6a6a;
		color: #6a6a6a;
	}

	.menu-post:disabled {
		border: 1px solid #dedede;
		color: #dedede;
	}

	.input-container {
		margin-top: 40px;
	}

	.input-container.long-space {
		margin-top: 80px;
	}

	.input-select {
		border: 0;
		border-bottom: 2px solid #ffca64;
		padding: 2px 4px;
		width: 100%;
		font-family: inherit;
		font-size: 16px;
		outline: none;
	}

	.input-select > .none {
		font-style: italic;
	}

	.preview-container {
		margin-top: 80px;
	}
</style>

<script>
	import 'font-awesome/css/font-awesome.css';

	import autosize from 'autosize';
	import axios from 'axios';
	import DOMPurify from 'dompurify';
	import marked from 'marked';
	import { createEventDispatcher, onMount } from 'svelte';

	import { token } from '../../stores/token';

	import Input from '../input/Input';
	import InputLabel from '../input/InputLabel';
	import InputMulti from '../input/InputMulti';
	import Post from '../post/Post';

	const dispatch = createEventDispatcher();

	let apiToken = null;
	let categories = [];
	let tab = 'editor';
	let accessLevel;
	let category;
	let slug = '';
	let slugError = '';
	let title = '';
	let titleError = '';
	let content = '';
	let contentError = '';
	let htmlContent = '';
	let locked = false;

	token.subscribe((token) => (apiToken = token));

	(async () => {
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
		} catch {}
	})();

	onMount(() => autosize(document.querySelectorAll('textarea')));

	function generateMarkdown() {
		htmlContent = DOMPurify.sanitize(marked(content));
	}

	function validateSlug() {
		if (!slug) slugError = 'Slug required.';
		else if (!/^[a-z\d-]+$/.test(slug))
			slugError =
				'Only lowercase alphanumeric characters and hyphens are allowed.';
		else if (/^-+/.test(slug))
			slugError = 'Slug cannot start with a hyphen.';
		else if (/-+$/.test(slug)) slugError = 'Slug cannot end with a hyphen.';
		else if (slug.length < 5)
			slugError = 'Slug must be at least 5 characters.';
		else if (slug.length > 256)
			slugError = 'Slug cannot exceed 256 characters.';
		else slugError = '';
	}

	function validateContent() {
		content = content.trim();

		if (!content) contentError = 'Content required.';
	}
</script>

<div>
	<div class="menu-container">
		<div class="menu-tab-container">
			<button
				class="menu-tab-button font sans-serif"
				class:active="{tab === 'editor'}"
				on:click="{() => (tab = 'editor')}"
			>
				Editor
			</button>
			<button
				class="menu-tab-button font sans-serif"
				class:active="{tab === 'preview'}"
				on:click="{() => {
					generateMarkdown();
					tab = 'preview';
				}}"
			>
				Preview
			</button>
		</div>
		<button class="menu-post font sans-serif">Post</button>
	</div>
	{#if tab === 'editor'}
		<div class="input-container long-space font serif">
			<InputLabel label="Access Level">
				<select class="input-select" bind:value="{accessLevel}">
					<option value="public" selected>Public</option>
					<option value="unlisted">Unlisted</option>
					<option value="private">Private</option>
				</select>
			</InputLabel>
		</div>
		<div class="input-container font serif">
			<InputLabel label="Category">
				<select class="input-select" bind:value="{category}">
					<option class="none" value="">None</option>
					{#each categories as category}
						<option>{category.name}</option>
					{/each}
				</select>
			</InputLabel>
		</div>
		<div class="input-container font serif">
			<InputLabel label="Slug">
				<Input
					placeholder="Slug"
					on:value="{() => {
						slug = slug.trim();
						validateSlug();
					}}"
					bind:value="{slug}"
					bind:error="{slugError}"
				/>
			</InputLabel>
		</div>
		<div class="input-container font serif">
			<InputLabel label="Title">
				<Input
					placeholder="Title"
					on:value="{() => {
						title = title.trim();
						if (!title) titleError = 'Title required.';
						else if (title.length > 128) titleError = 'Title cannot exceed 128 characters.';
						slug = title
							.replace(/[^a-zA-Z\d-]+/g, '-')
							.replace(
								/^-*([a-zA-Z\d][a-zA-Z\d-]*[a-zA-Z\d])-*$/g,
								'$1'
							);
						validateSlug();
					}}"
					bind:value="{title}"
					bind:error="{titleError}"
				/>
			</InputLabel>
		</div>
		<div class="input-container font sans-serif">
			<InputLabel label="Content">
				<InputMulti
					placeholder="Content"
					disabled="{locked}"
					on:value="{() => validateContent()}"
					bind:value="{content}"
					bind:error="{contentError}"
				/>
			</InputLabel>
		</div>
	{:else}
		<div class="preview-container">
			<Post
				category="{category}"
				title="{title}"
				content="{htmlContent}"
				on:click="{() => dispatch('post', {
						slug,
						accessLevel,
						category,
						title,
						content,
					})}"
			/>
		</div>
	{/if}
</div>
