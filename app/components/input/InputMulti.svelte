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
		border: 2px solid #ffca64;
		border-radius: 4px;
		padding: 4px 6px;
		width: 100%;
		min-height: 15em;
		font-family: inherit;
		font-size: 18px;
		line-height: 1.5em;
		outline: none;
		resize: none;
	}
</style>

<script>
	import autosize from 'autosize';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	onMount(() => autosize(document.querySelectorAll('textarea')));

	export let value = '';
	export let error = '';
	export let placeholder = '';
	export let disabled = false;

	function onKeydownTextarea(event) {
		if ((event.keyCode || event.which) == 9) {
			event.preventDefault();

			const start = event.target.selectionStart;
			const end = event.target.selectionEnd;

			function indexOrDefault(index, defaultIndex) {
				return index === -1 ? defaultIndex : index;
			}

			const startIndex = indexOrDefault(
				event.target.value.lastIndexOf(
					'\n',
					event.target.selectionStart - 1
				),
				0
			);
			const endIndex = indexOrDefault(
				event.target.value.indexOf('\n', event.target.selectionEnd),
				event.target.value.length
			);
			const firstLineFirstCharacterSelected = start === startIndex;
			const lastLineFirstCharacterSelected =
				end !== event.target.value.lastIndexOf('\n', endIndex - 1) + 1;

			let replacement = event.target.value.substring(
				startIndex,
				endIndex
			);
			let selectionStart = start;
			let selectionEnd = end;

			if (!!event.shiftKey) {
				if (/^\t/.test(replacement) && !firstLineFirstCharacterSelected)
					--selectionStart;

				if (
					/\t.*$/.test(replacement) &&
					!lastLineFirstCharacterSelected
				)
					++selectionEnd;

				let replacementLength = replacement.length;
				replacement = replacement.replace(/^\t/gm, '');

				selectionEnd -= replacementLength - replacement.length;
			} else if (start !== end) {
				if (!firstLineFirstCharacterSelected) ++selectionStart;

				if (!lastLineFirstCharacterSelected) --selectionEnd;

				let replacementLength = replacement.length;
				replacement = `\t${replacement.replace(/\n(?!$)/g, '\n\t')}`;

				selectionEnd += replacement.length - replacementLength;
			} else {
				selectionStart = selectionEnd = start + 1;

				replacement = `${replacement.substring(
					0,
					start - startIndex
				)}\t${replacement.substring(start - startIndex)}`;
			}

			event.target.value = `${event.target.value.substring(
				0,
				startIndex
			)}${replacement}${event.target.value.substring(endIndex)}`;

			event.target.selectionStart = selectionStart;
			event.target.selectionEnd = selectionEnd;
		}
	}
</script>

<div>
	<textarea
		class="input"
		placeholder="{placeholder}"
		disabled="{disabled}"
		on:focus="{() => (error = '')}"
		on:blur="{() => dispatch('value')}"
		on:keydown="{onKeydownTextarea}"
		bind:value
	></textarea>
	<p class="font sans-serif error" class:show="{error}">{error || 'N/A'}</p>
</div>
