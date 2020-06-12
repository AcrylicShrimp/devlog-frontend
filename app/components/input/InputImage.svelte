<style>
	.label {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-left: 15px;
		border: none;
		border-radius: 4px;
		padding: 4px;
		height: 100px;
		background-color: transparent;
		font-size: 18px;
		color: #a5a5a5;
		cursor: pointer;
		outline: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: color 0.2s, box-shadow 0.2s;
	}

	.label:not(:disabled):hover {
		color: #404040;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.24);
	}

	.label:disabled {
		color: #dedede;
	}

	.label > .fa-image {
		margin-right: 0.5em;
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
	import '../../font-awesome/css/all.css';

	import { createEventDispatcher } from 'svelte';
	import InputImagePreview from './InputImagePreview';

	export let images = [];

	const dispatch = createEventDispatcher();
</script>

<label for="image-upload" class="label">
	<i class="far fa-image"></i>
	Click here to upload image!
</label>
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
