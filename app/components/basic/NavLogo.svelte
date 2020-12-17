<style>
	.logo-link {
		text-decoration: none;
	}

	.logo-text {
		font-family: 'Raleway', sans-serif;
		font-size: 34px;
		color: white;
		user-select: none;
	}
</style>

<script>
	import { url } from '@sveltech/routify';
</script>

<a class="logo-link" href="{$url('/')}" target="_self">
	<span class="logo-text">devlog</span>
</a>
