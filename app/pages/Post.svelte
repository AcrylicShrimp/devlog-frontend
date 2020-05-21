<script>
	import axios from 'axios';

	import { token } from '../stores/token';

	import Error from './Error';
	import Post from '../components/post/Post';

	let post = undefined;
	let apiToken = null;
	export let params = {};

	token.subscribe((token) => (apiToken = token));

	(async () => {
		try {
			const result = await axios.get(
				`https://api.blog.ashrimp.dev/posts/${params.slug}`,
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			post = result.data;
		} catch (err) {
			post = null;

			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set(null);
		}
	})();
</script>

{#if post}
	<Post
		category="{post.category ? post.category.name : undefined}"
		created="{post.createdAt}"
		title="{post.title}"
		content="{post.htmlContent}"
	/>
{:else if post === null}
	<Error message="Post not found!" />
{/if}
