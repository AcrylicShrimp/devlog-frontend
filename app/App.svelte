<script>
	import Router from 'svelte-spa-router';
	import { replace } from 'svelte-spa-router';

	import Content from './components/basic/Content';
	import Footer from './components/basic/Footer';
	import Nav from './components/basic/Nav';

	import Categories from './pages/Categories.svelte';
	import List from './pages/List';
	import Login from './pages/Login';
	import NewPost from './pages/NewPost';
	import NotFound from './pages/NotFound';
	import Post from './pages/Post';

	import { token } from './stores/token';

	const routes = {
		'/': List,
		'/categories': Categories,
		'/post': NewPost,
		'/posts/:slug': Post,
		'/login': Login,
		'*': NotFound,
	};

	if (!window.location.hash || window.location.hash == '#')
		history.replaceState(undefined, undefined, '#/');

	token.set(localStorage.getItem('api-token') || null);
</script>

<Nav />
<Content>
	<Router routes="{routes}" on:routeLoaded="{() => window.scrollTo(0, 0)}" />
</Content>
<Footer />
