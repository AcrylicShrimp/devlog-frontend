<style>
	.input {
		border: 0;
		border-radius: 4px;
		padding: 8px 12px;
		width: 100%;
		font-family: inherit;
		font-size: 16px;
		outline: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: box-shadow 0.2s;
	}

	.input:not(:disabled):hover {
		box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.24);
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value = '';
	export let placeholder = '';
	export let disabled = false;
</script>

<input
	class="input"
	type="text"
	placeholder="{placeholder}"
	disabled="{disabled}"
	on:keydown="{(e) => {
		if (e.key === 'Enter') dispatch('value');
	}}"
	bind:value
/>
