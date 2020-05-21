<script>
	import autosize from 'autosize';
	import { onMount } from 'svelte';

	import Input from '../input/Input.svelte';
	import InputLabel from '../input/InputLabel.svelte';

	onMount(() => autosize(document.querySelectorAll('textarea')));
</script>

<div>
	<div class="font serif">
		<InputLabel label="Title">
			<Input
				placeholder="Title"
				regex="{/\d+/}"
				errmsg="Title required."
			/>
		</InputLabel>
	</div>
	<!-- <textarea></textarea> -->
</div>
