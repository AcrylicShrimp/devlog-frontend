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

	let error = false;
	export let hide = false;
	export let disabled = false;
	export let regex = /^\s\S*$/;
	export let placeholder;
	export let errmsg = '';
	export let defaultValue = '';

	function onBlurInput(event) {
		const value = event.target.value;

		error = !regex.test(value);
		dispatch('value', {
			value: error ? undefined : value,
		});
	}
</script>

<div>
	<input
		class="input"
		type="{hide ? 'password' : 'text'}"
		disabled="{disabled}"
		placeholder="{placeholder}"
		on:focus="{() => (error = false)}"
		on:blur="{onBlurInput}"
		value="{defaultValue}"
	/>
	<p class="font sans-serif error" class:show="{error}">{errmsg}</p>
</div>
