<style>
	.container {
		margin: 0 auto;
		padding: 0 5px;
		max-width: 350px;
	}

	.input-container + .input-container {
		margin-top: 40px;
	}

	.button-container {
		margin-top: 60px;
		text-align: center;
	}

	.login-button {
		border: none;
		border-radius: 4px;
		padding: 4px;
		width: 60px;
		background-color: transparent;
		font-size: 18px;
		color: #a5a5a5;
		cursor: pointer;
		outline: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: color 0.2s, box-shadow 0.2s;
	}

	.login-button:not(:disabled):hover {
		color: #6a6a6a;
		box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.24);
	}
</style>

<script>
	import { faSignIn } from '@fortawesome/pro-regular-svg-icons';
	import { goto } from '@sveltech/routify';
	import axios from 'axios';

	import { token } from '../stores/token';

	import Fontawesome from '../components/basic/Fontawesome';
	import Input from '../components/input/Input';
	import InputHide from '../components/input/InputHide';
	import InputLabel from '../components/input/InputLabel';

	let authenticating = false;
	let username;
	let usernameError;
	let password;
	let passwordError;

	async function onClickButton() {
		if (authenticating) return;

		authenticating = true;

		try {
			const result = await axios.post(
				'https://api.blog.ashrimp.dev/admin/sessions',
				{
					username,
					pw: password,
				}
			);

			token.set(result.data);

			$goto('/');
		} catch {
			alert('Authentication failed.');
		} finally {
			authenticating = false;
		}
	}
</script>

<svelte:head>
	<title>Login :: devlog</title>
</svelte:head>
<div class="container">
	<div class="input-container font sans-serif">
		<InputLabel label="Username">
			<Input
				regex="{/^\S+$/}"
				placeholder="Username"
				disabled="{authenticating}"
				on:value="{(event) => {
					username = username.trim();
					if (!username) usernameError = 'Username required.';
					else if (/\s/.test(username)) usernameError = 'Whitespaces are not allowed.';
				}}"
				bind:value="{username}"
				bind:error="{usernameError}"
			/>
		</InputLabel>
	</div>
	<div class="input-container font sans-serif">
		<InputLabel label="Password">
			<InputHide
				placeholder="Password"
				disabled="{authenticating}"
				on:value="{(event) => {
					if (!password) passwordError = 'Password required.';
					else if (password.length < 6) passwordError = 'Password must be at least 6 characters.';
				}}"
				bind:value="{password}"
				bind:error="{passwordError}"
			/>
		</InputLabel>
	</div>
	<div class="button-container">
		<button
			class="login-button"
			type="button"
			on:click="{onClickButton}"
			disabled="{!(username && password) || authenticating}"
		>
			<Fontawesome icon="{faSignIn}" />
		</button>
	</div>
</div>
