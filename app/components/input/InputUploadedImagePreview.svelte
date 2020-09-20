<style>
	.image {
		display: inline-block;
		border-radius: 4px;
		width: 100%;
		cursor: pointer;
	}

	.label {
		margin: 0;
		text-align: center;
		text-overflow: ellipsis;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let index;
	export let image;
</script>

<div>
	<img
		class="image"
		alt="{`Uploaded ${index}th image`}"
		src="{image.url}"
		on:click="{() => dispatch('click')}"
	/>
	<p class="label">Uploaded {index + 1}th image</p>
</div>
