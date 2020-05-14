<script>
	import Router from 'svelte-spa-router';
	import { replace } from 'svelte-spa-router';

	import Content from './components/basic/Content';
	import Footer from './components/basic/Footer';
	import Nav from './components/basic/Nav';

	import List from './pages/List';
	import Login from './pages/Login';
	import NotFound from './pages/NotFound';
	import Post from './pages/Post';

	const routes = {
		'/': List,
		'/:slug': Post,
		'/login': Login,
		'*': NotFound,
	};

	if (!window.location.hash || window.location.hash == '#')
		history.replaceState(undefined, undefined, '#/');
</script>

<Nav />
<Content>
	<Router routes="{routes}" />
</Content>
<Footer />
