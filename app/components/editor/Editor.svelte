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

	.category-select {
		border: 0;
		border-bottom: 2px solid #ffca64;
		padding: 2px 4px;
		width: 100%;
		font-family: inherit;
		font-size: 16px;
		outline: none;
	}

	.category-select > .none {
		font-style: italic;
	}

	.content-textarea {
		border: 2px solid #ffca64;
		border-radius: 4px;
		padding: 6px;
		width: 100%;
		min-height: 15em;
		font-size: 18px;
		line-height: 1.8em;
		outline: none;
		resize: none;
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
	import { onMount } from 'svelte';

	import { token } from '../../stores/token';

	import Input from '../input/Input';
	import InputLabel from '../input/InputLabel';
	import Post from '../post/Post';

	let apiToken = null;
	let categories = [];
	let tab = 'editor';
	let category;
	let title = '';
	let content = '';
	let htmlContent = '';

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
			<InputLabel label="Category">
				<select class="category-select" bind:value="{category}">
					<option class="none" value="">None</option>
					{#each categories as category}
						<option>{category.name}</option>
					{/each}
				</select>
			</InputLabel>
		</div>
		<div class="input-container font serif">
			<InputLabel label="Title">
				<Input
					placeholder="Title"
					regex="{/.*\S.*/}"
					errmsg="Title required."
					defaultValue="{title}"
					on:value="{(event) => (title = event.detail.value || '')}"
				/>
			</InputLabel>
		</div>
		<div class="input-container font sans-serif">
			<InputLabel label="Content">
				<textarea
					class="content-textarea"
					bind:value="{content}"
				></textarea>
			</InputLabel>
		</div>
	{:else}
		<div class="preview-container">
			<Post
				category="{category}"
				title="{title}"
				content="{htmlContent}"
			/>
		</div>
	{/if}
</div>
