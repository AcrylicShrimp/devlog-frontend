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

	.fa-image {
		margin-right: 0.5em;
	}

	.input {
		display: none;
	}

	.container {
		display: grid;
		gap: 6px;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		align-content: start;
		align-items: center;
		justify-content: space-evenly;
		margin-top: 6px;
	}
</style>

<script>
	import { faImage } from '@fortawesome/pro-regular-svg-icons';

	import Fontawesome from '../basic/Fontawesome';
	import InputImagePreview from './InputImagePreview';

	export let thumbnail;
</script>

<label for="thumbnail-upload" class="label"><span class="fa-image"><Fontawesome
			icon="{faImage}"
		/></span>Click here to upload thumbnail!</label>
<input
	id="thumbnail-upload"
	type="file"
	class="input"
	on:change="{(event) => {
		thumbnail = event.target.files[0];
	}}"
/>
<div class="container">
	{#if thumbnail}
		<InputImagePreview image="{thumbnail}" />
	{/if}
</div>
