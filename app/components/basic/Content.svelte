<style>
	.content-container {
		padding-bottom: 120px;
		min-height: 100vh;
	}

	.content-container-inner {
		background: white;
		margin-left: auto;
		margin-right: auto;
		padding: 80px 30px 50px;
		max-width: 860px;
		min-height: 500px;
		box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.16);
	}
</style>

<div class="content-container">
	<div class="content-container-inner">
		<slot />
	</div>
</div>
