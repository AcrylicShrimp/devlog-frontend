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
		padding: 15px 12px 35px 12px;
		max-width: 860px;
		min-height: 200px;
	}

	.footer-text {
		font-family: 'Raleway', sans-serif;
		font-size: 16px;
		color: #dbdbdb;
		text-decoration: none;
	}

	.footer-text + .footer-text {
		margin-top: 12px;
	}

	.footer-spacer {
		margin-top: 35px;
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
</style>

<script>
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import { faTwitter } from '@fortawesome/free-brands-svg-icons';
	import { faEnvelope } from '@fortawesome/pro-regular-svg-icons';
	import { url } from '@sveltech/routify';
	import axios from 'axios';

	import Fontawesome from './Fontawesome';

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

			token.set('');

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
				href="{$url('/managements/categories')}"
			>
				Manage categories
			</a>
			<a
				class="footer-text footer-button"
				href="{$url('/managements/post-writer')}"
			>
				Write a new post
			</a>
		{:else}
			<a class="footer-text footer-button" href="{$url('/login')}">
				Login
			</a>
		{/if}
		<div class="footer-spacer"></div>
		<a
			class="footer-text"
			href="https://github.com/AcrylicShrimp"
			target="_blank"
		>
			<Fontawesome icon="{faGithub}" />
			AcrylicShrimp</a>
		<a
			class="footer-text"
			href="https://twitter.com/AcrylicShrimp"
			target="_blank"
		>
			<Fontawesome icon="{faTwitter}" />
			AcrylicShrimp</a>
		<a
			class="footer-text"
			href="mailto:led789zxpp@naver.com"
			target="_blank"
		>
			<Fontawesome icon="{faEnvelope}" />
			led789zxpp@naver.com</a>
		<span class="footer-text">
			&copy;
			{new Date().getFullYear() === 2020 ? '2020' : `2020-${new Date().getFullYear()}`}
			AcrylicShrimp All rights reserved.
		</span>
	</div>
</footer>
