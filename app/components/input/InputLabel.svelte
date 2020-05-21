<style>
	.label {
		margin: 0;
		font-size: 16px;
		font-family: inherit;
		color: #1a1a1a;
	}

	.container {
		margin-top: 15px;
		padding-left: 20px;
		font-family: inherit;
	}
</style>

<script>
	export let label;
</script>

<p class="label">{label}</p>
<div class="container">
	<slot />
</div>
