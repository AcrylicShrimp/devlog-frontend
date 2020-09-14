<script>
	import { Router } from '@sveltech/routify';

	import { routes } from './.routify/routes';

	import { token } from './stores/token';

	token.set(localStorage.getItem('api-token') || null);
</script>

<Router routes="{routes}" on:routeLoaded="{() => window.scrollTo(0, 0)}" />
