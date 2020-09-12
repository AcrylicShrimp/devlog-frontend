<style>
	.category {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: start;
		border-radius: 6px;
		padding: 12px 16px;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
	}

	.category + .category {
		margin-top: 18px;
	}

	.category-inner-container {
		flex-basis: auto;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.category-inner-container.long {
		flex-basis: 0;
		flex-grow: 1;
		flex-shrink: 1;
	}

	.category-inner-container.right {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
	}

	.category-inner-container + .category-inner-container {
		margin-left: 25px;
	}

	.input-container + .input-container {
		margin-top: 20px;
	}

	.category-button {
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

	.category-button.red {
		color: #ff8c8c;
	}

	.category-button:not(:disabled):hover {
		color: #6a6a6a;
		box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.24);
	}

	.category-button.red:not(:disabled):hover {
		color: #ff2e2e;
	}

	.category-button + .category-button {
		margin-top: 15px;
	}

	.category-add-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 18px;
		border: none;
		border-radius: 4px;
		padding: 4px;
		width: 100%;
		height: 100px;
		background-color: transparent;
		font-size: 18px;
		color: #a5a5a5;
		cursor: pointer;
		outline: none;
		box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.16);
		transition: color 0.2s, box-shadow 0.2s;
	}

	.category-add-button:not(:disabled):hover {
		color: #404040;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.24);
	}

	.category-add-button:disabled {
		color: #dedede;
	}
</style>

<script>
	import '../font-awesome/css/all.css';

	import axios from 'axios';

	import { token } from '../stores/token';

	import Error from './Error';
	import Input from '../components/input/Input';
	import InputLabel from '../components/input/InputLabel';

	let categories = undefined;
	let apiToken = null;

	token.subscribe((token) => {
		categories = undefined;
		apiToken = token;
		updateCategoryList();
	});

	async function updateCategoryList() {
		try {
			const result = await axios.get(
				'https://api.blog.ashrimp.dev/categories',
				{
					headers: apiToken && {
						'Api-Token': apiToken,
					},
				}
			);

			categories = result.data.map((category) => {
				category.exists = true;
				category.locked = false;
				category.originName = category.name;
				category.originDescription = category.description;
				category.nameError = undefined;
				category.descError = undefined;
				return category;
			});
		} catch (err) {
			categories = null;

			if (
				err.response &&
				err.response.status &&
				err.response.status === 401
			)
				token.set(null);
		}
	}
</script>

<svelte:head>
	<title>Categories :: devlog</title>
</svelte:head>
{#if categories}
	{#if categories.length}
		{#each categories as category}
			<div class="category">
				<div class="category-inner-container long">
					<div class="input-container font sans-serif">
						<InputLabel label="Name">
							<Input
								placeholder="{category.originName || 'Name'}"
								disabled="{category.locked}"
								on:value="{() => {
									category.name = category.name.trim();
									if (!category.name) category.nameError = 'Name required.';
									else if (category.name.length > 32) category.nameError = 'Name cannot exceed 32 characters.';
									if (1 < categories.filter((otherCategory) => otherCategory.name === category.name).length) category.nameError = 'This name is already taken.';
								}}"
								bind:value="{category.name}"
								bind:error="{category.nameError}"
							/>
						</InputLabel>
					</div>
					<div class="input-container font sans-serif">
						<InputLabel label="Description">
							<Input
								placeholder="{category.originDescription || 'Description'}"
								disabled="{category.locked}"
								on:value="{() => {
									category.description = category.description.trim();
									if (category.description.length > 256) category.descError = 'Category description cannot exceed 256 characters.';
								}}"
								bind:value="{category.description}"
								bind:error="{category.descError}"
							/>
						</InputLabel>
					</div>
				</div>
				<div class="category-inner-container right">
					{#if category.exists}
						<button
							class="category-button red"
							on:click="{async () => {
								if (category.locked) return;
								category.locked = true;
								try {
									await axios.delete(
										`https://api.blog.ashrimp.dev/admin/categories/${category.originName}`,
										{
											headers: apiToken && {
												'Api-Token': apiToken,
											},
										}
									);
									updateCategoryList();
								} catch (err) {
									if (err.response && err.response.status && err.response.status === 401) token.set(null);
									else alert('Error occurred.');
								}
							}}"
						>
							<i class="far fa-trash-alt"></i>
						</button>
					{/if}
					<button
						class="category-button"
						on:click="{async () => {
							if (category.locked) return;
							category.locked = true;
							try {
								if (category.exists) await axios.patch(`https://api.blog.ashrimp.dev/admin/categories/${category.originName}`, { 'new-name': category.name, 'new-desc': category.description }, { headers: apiToken && { 'Api-Token': apiToken } });
								else await axios.post(`https://api.blog.ashrimp.dev/admin/categories`, { name: category.name, desc: category.description }, { headers: apiToken && { 'Api-Token': apiToken } });
								category.exists = true;
								category.originName = category.name;
								category.originDescription = category.description;
							} catch (err) {
								if (err.response && err.response.status && err.response.status === 401) token.set(null);
								else alert('Error occurred.');
							} finally {
								category.locked = false;
							}
						}}"
					>
						<i class="far fa-save"></i>
					</button>
				</div>
			</div>
		{/each}
	{:else}
		<Error message="No category yet!" />
	{/if}
	<button
		class="category-add-button"
		on:click="{() => {
			categories.push({
				name: '',
				description: '',
				createdAt: new Date(),
				modifiedAt: new Date(),
				exists: false,
				locked: false,
				originName: '',
				nameError: undefined,
				descError: undefined,
			});
			categories = categories;
		}}"
	>
		<i class="far fa-plus-circle"></i>
	</button>
{:else if categories === null}
	<Error message="Unable to load categories!" />
{/if}
