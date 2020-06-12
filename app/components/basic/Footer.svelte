<style>
	.footer-container {
		background-color: #5d5d5d;
		box-shadow: 0px -6px 12px -6px rgba(0, 0, 0, 0.16);
	}
	.footer-container-inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: start;
		margin-left: auto;
		margin-right: auto;
		padding: 15px 12px;
		max-width: 860px;
		min-height: 150px;
	}

	.footer-text {
		font-family: 'Raleway', sans-serif;
		font-size: 16px;
		color: #dbdbdb;
	}

	.footer-button {
		display: block;
		border: 1px solid #dbdbdb;
		border-radius: 3px;
		padding: 4px 8px;
		width: 100%;
		max-width: 150px;
		background-color: transparent;
		font-size: 14px;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		outline: none;
	}

	.footer-button + .footer-button {
		margin-top: 5px;
	}

	.footer-text:last-child {
		margin-top: auto;
	}
</style>

<script>
	import axios from 'axios';
	import { link, push } from 'svelte-spa-router';

	import { token } from '../../stores/token';

	let loggingOut = false;
	let apiToken;
	let authenticated;

	token.subscribe((token) => (authenticated = !!(apiToken = token)));

	async function onClickLogout() {
		if (loggingOut) return;

		loggingOut = true;

		try {
			await axios.delete(
				`https://api.blog.ashrimp.dev/admin/sessions/${apiToken}`
			);

			sessionStorage.removeItem('api-token');
			token.set(null);

			push('/');
		} catch {
		} finally {
			loggingOut = false;
		}
	}
</script>

<footer class="footer-container">
	<div class="footer-container-inner">
		{#if authenticated}
			<button
				type="button"
				class="footer-text footer-button"
				on:click="{onClickLogout}"
			>
				Logout
			</button>
			<a
				class="footer-text footer-button"
				href="/new-post"
				target="_self"
				use:link
			>
				Write a new post
			</a>
			<a
				class="footer-text footer-button"
				href="/categories"
				target="_self"
				use:link
			>
				Manage categories
			</a>
		{:else}
			<a
				class="footer-text footer-button"
				href="/login"
				target="_self"
				use:link
			>
				Login
			</a>
		{/if}
		<span class="footer-text">
			&copy; {new Date().getFullYear() === 2020 ? '2020' : `2020-${new Date().getFullYear()}`}
			AcrylicShrimp All rights reserved.
		</span>
	</div>
</footer>
