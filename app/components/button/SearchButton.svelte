<style>
	.button {
		display: inline-block;
		margin: 0;
		padding: 4px 12px;
		border: none;
		border-radius: 4px;
		background-color: transparent;
		font-size: 16px;
		height: 100%;
		color: #ffc85f;
		cursor: pointer;
		outline: none;
		text-align: center;
		text-decoration: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: color 0.2s, box-shadow 0.2s;
	}

	.button:not(.disabled):hover {
		color: #404040;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.24);
	}

	.button:disabled {
		cursor: default;
		color: #404040;
	}
</style>

<script>
	import { faSearch } from '@fortawesome/pro-regular-svg-icons';

	import { createEventDispatcher } from 'svelte';

	import Fontawesome from '../basic/Fontawesome';

	const dispatch = createEventDispatcher();
</script>

<button class="button" on:click="{() => dispatch('click')}"><Fontawesome
		icon="{faSearch}"
	/></button>
