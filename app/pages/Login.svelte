<style>
	.container {
		margin: 0 auto;
		padding: 0 5px;
		max-width: 300px;
	}

	.spacer {
		display: block;
		height: 10px;
	}

	.button-container {
		margin-top: 60px;
		text-align: center;
	}
</style>

<script>
	import axios from 'axios';
	import { push } from 'svelte-spa-router';

	import { token } from '../stores/token';

	import Input from '../components/input/Input';

	let authenticating = false;
	let username;
	let password;

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

			sessionStorage.setItem('api-token', result.data);
			token.set(result.data);

			push('/');
		} catch {
			alert('Authentication failed.');
		} finally {
			authenticating = false;
		}
	}
</script>

<div class="container">
	<Input
		regex="{/^\S+$/}"
		placeholder="Username"
		errmsg="Username cannot be empty"
		on:value="{(event) => (username = event.detail.value)}"
		disabled="{authenticating}"
	/>
	<span class="spacer"></span>
	<Input
		hide
		regex="{/^.{6,}$/}"
		placeholder="Password"
		errmsg="Password must be at least 6 characters long"
		on:value="{(event) => (password = event.detail.value)}"
		disabled="{authenticating}"
	/>
	<div class="button-container">
		<button
			type="button"
			on:click="{onClickButton}"
			disabled="{!(username && password) || authenticating}"
		>
			Login
		</button>
	</div>
</div>
