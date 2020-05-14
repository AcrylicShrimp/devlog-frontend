<style>
	.nav-container {
		position: relative;
		height: 60px;
		background-color: #ffc85f;
		box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
		z-index: 1000;
	}

	.nav-container-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		margin-left: auto;
		margin-right: auto;
		padding-right: 10px;
		max-width: 860px;
		height: 100%;
	}

	.nav-logo-spacer {
		margin-right: auto;
	}
</style>

<script>
	import NavLogo from './NavLogo.svelte';
</script>

<nav class="nav-container">
	<div class="nav-container-inner">
		<span class="nav-logo-spacer"></span>
		<NavLogo />
	</div>
</nav>
