<style>
	.logo-link {
		text-decoration: none;
	}

	.logo-text {
		font-family: 'Raleway', sans-serif;
		font-size: 34px;
		color: white;
	}
</style>

<script>
	import { link } from 'svelte-spa-router';
</script>

<a class="logo-link" href="/" use:link>
	<span class="logo-text">devlog</span>
</a>
