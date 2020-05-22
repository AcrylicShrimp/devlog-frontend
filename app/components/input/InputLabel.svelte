<style>
	.label {
		margin: 0;
		font-size: 18px;
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

<p class="font sans-serif raleway label">{label}</p>
<div class="container">
	<slot />
</div>
