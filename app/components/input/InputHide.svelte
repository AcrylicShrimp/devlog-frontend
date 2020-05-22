<style>
	.error {
		visibility: hidden;
		margin: 0;
		padding-left: 10px;
		margin-top: 10px;
		font-size: 13px;
		color: #ff5a5a;
	}

	.error.show {
		visibility: unset;
	}

	.input {
		border: 0;
		border-bottom: 2px solid #ffca64;
		padding: 2px 4px;
		width: 100%;
		font-family: inherit;
		font-size: 16px;
		outline: none;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value = '';
	export let error = '';
	export let placeholder = '';
	export let disabled = false;
</script>

<div>
	<input
		class="input"
		type="password"
		placeholder="{placeholder}"
		disabled="{disabled}"
		on:focus="{() => (error = '')}"
		on:blur="{() => dispatch('value')}"
		bind:value
	/>
	<p class="font sans-serif error" class:show="{error}">{error || 'N/A'}</p>
</div>
