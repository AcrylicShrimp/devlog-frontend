<style>
	.message-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		min-height: 500px;
	}

	.message {
		margin: 0;
		font-family: 'Raleway', sans-serif;
		font-size: 21px;
		text-align: center;
		color: #bfbfbf;
	}
</style>

<script>
	export let message;
</script>

<div class="message-container">
	<p class="message">{message}</p>
</div>
