<style>
	.fa-svelte {
		width: 1em;
		height: 1em;
		overflow: visible;
		display: inline-block;
		vertical-align: bottom;
	}
</style>

<script>
	let path = [];
	let classes = '';
	let viewBox = '';
	export let icon;

	$: viewBox = '0 0 ' + icon.icon[0] + ' ' + icon.icon[1];
	$: classes = 'fa-svelte ' + ($$props.class ? $$props.class : '');
	$: path = icon.icon[4];
</script>

<svg
	aria-hidden="true"
	class="{classes}"
	role="img"
	viewBox="{viewBox}"
	xmlns="http://www.w3.org/2000/svg"
>
	<path fill="currentColor" d="{path}"></path>
</svg>
