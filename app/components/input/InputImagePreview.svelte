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
	import { onMount, afterUpdate, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let src;
	export let image;

	afterUpdate(() => {
		const reader = new FileReader();

		reader.onload = (event) => (src = event.target.result);
		reader.readAsDataURL(image);
	});
</script>

<div>
	{#if src !== '#'}
		<img
			class="image"
			alt="{image.name}"
			src="{src}"
			on:click="{() => dispatch('click')}"
		/>
	{/if}
	<p class="label">{image.name}</p>
</div>
