<script>
	import { afterPageLoad, ready, goto } from '@sveltech/routify';
	import axios from 'axios';

	import { token } from '../../../stores/token';

	import Editor from '../../../components/editor/Editor';

	let post = undefined;
	let posting = false;
	let apiToken = null;
	export let slug;

	token.subscribe((token) => {
		if (!(apiToken = token)) $goto('/');
	});

	updatePost().finally($ready);

	async function updatePost() {
		try {
			const result = await axios.get(
				`https://api.blog.ashrimp.dev/posts/${slug}`,
				{
					headers: {
						'Api-Token': apiToken,
					},
				}
			);

			post = result.data;
			post.slug = slug;
		} catch (err) {
			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set('');
			else $goto('/');
		}
	}

	async function onPost(event) {
		if (posting) return;

		posting = true;

		try {
			await axios.patch(
				`https://api.blog.ashrimp.dev/admin/posts/${slug}`,
				{
					'new-slug': event.detail.slug,
					'new-access-level': event.detail.accessLevel,
					'new-category': event.detail.category,
					'new-title': event.detail.title,
				},
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			if (event.detail.thumbnail) {
				const thumbnail = new FormData();

				thumbnail.append('image', event.detail.thumbnail);

				await axios.put(
					`https://api.blog.ashrimp.dev/admin/posts/${event.detail.slug}/thumbnail`,
					thumbnail,
					{
						headers: apiToken && {
							'Api-Token': apiToken,
						},
					}
				);
			}

			if (event.detail.images.length) {
				const images = new FormData();

				event.detail.images.forEach((image) =>
					images.append('images', image)
				);

				await axios.post(
					`https://api.blog.ashrimp.dev/admin/posts/${event.detail.slug}/images`,
					images,
					{
						headers: apiToken && {
							'Api-Token': apiToken,
						},
					}
				);
			}

			await axios.put(
				`https://api.blog.ashrimp.dev/admin/posts/${event.detail.slug}/content`,
				{
					content: event.detail.content,
				},
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			$goto('/posts/:slug', { slug: event.detail.slug });
		} catch (err) {
			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set('');
			else if (
				err.response &&
				err.response.status &&
				err.response.status === 409
			)
				alert('The slug is already taken.');
			else alert(`Error occurred: ${err}`);
		} finally {
			posting = false;
		}
	}
</script>

<svelte:head>
	{#if post}
		<title>Edit post - {post.title} :: devlog</title>
	{:else}
		<title>Edit post :: devlog</title>
	{/if}
</svelte:head>
<main>
	{#if post}
		<Editor post="{post}" on:post="{onPost}" />
	{/if}
</main>
