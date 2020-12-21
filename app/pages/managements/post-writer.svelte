<script>
	import { goto } from '@sveltech/routify';
	import axios from 'axios';

	import { token } from '../../stores/token';

	import Editor from '../../components/editor/Editor';

	let posting = false;
	let apiToken = null;

	token.subscribe((token) => {
		if (!(apiToken = token)) $goto('/');
	});

	async function onPost(event) {
		if (posting) return;

		posting = true;

		try {
			await axios.post(
				'https://api.blog.ashrimp.dev/admin/posts',
				{
					slug: event.detail.slug,
					'access-level': event.detail.accessLevel,
					category: event.detail.category,
					title: event.detail.title,
				},
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

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

				const thumbnail = new FormData();

				thumbnail.append('image', event.detail.images[0]);

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
	<title>New post :: devlog</title>
</svelte:head>
<main>
	<Editor on:post="{onPost}" />
</main>
