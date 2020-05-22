<style>
	.label {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		height: 100px;
		background-color: #d6d6d6;
		font-size: 18px;
		transition: background-color 0.2s;
	}

	.label:disabled {
		background-color: #acacac;
	}

	.label:not(:disabled):hover {
		background-color: #c2c2c2;
	}

	.label::before {
		margin-right: 0.5em;
		content: '\f093';
		font-family: 'FontAwesome';
		font-weight: normal;
		line-height: normal;
		vertical-align: baseline;
	}

	.input {
		display: none;
	}

	.container {
		display: grid;
		grid-gap: 6px;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		align-content: start;
		align-items: center;
		justify-content: space-evenly;
		margin-top: 6px;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	import InputImagePreview from './InputImagePreview';

	export let images = [];

	const dispatch = createEventDispatcher();
</script>

<label for="image-upload" class="label">Drag &amp; drop images here!</label>
<input
	id="image-upload"
	type="file"
	class="input"
	multiple
	on:change="{(event) => {
		Array.prototype.slice
			.call(event.target.files)
			.forEach((image, index) =>
				dispatch('insert', {
					index: index + images.length,
					name: image.name,
				})
			);
		images = [...images, ...event.target.files];
	}}"
/>
<div class="container">
	{#each images as image, index}
		<InputImagePreview
			index="{index}"
			image="{image}"
			on:click="{() => dispatch('insert', { index, name: image.name })}"
		/>
	{/each}
</div>
