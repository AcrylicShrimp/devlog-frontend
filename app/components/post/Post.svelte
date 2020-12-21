<style>
	.post-header-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.post-category {
		padding-left: 12px;
		font-size: 18px;
		color: #727272;
		visibility: hidden;
	}

	.post-category.exists {
		visibility: unset;
	}

	.post-icon {
		font-size: 18px;
		color: #727272;
		vertical-align: middle;
	}

	.post-date {
		font-size: 18px;
		color: #727272;
	}

	.post-title {
		margin: 0;
		margin-top: 32px;
		font-size: 34px;
		font-size: bold;
		color: #404040;
	}

	.post-content-container {
		margin-top: 30px;
	}
</style>

<script>
	import './halflife.css';
	import './Post.css';

	import { faLock, faLink } from '@fortawesome/pro-regular-svg-icons';
	import dayjs from 'dayjs';

	import Fontawesome from '../../components/basic/Fontawesome';

	export let accessLevel;
	export let category;
	export let created = Date.now();
	export let title;
	export let content;
</script>

<article>
	<header>
		<div class="post-header-container font serif">
			<span class="post-category" class:exists="{category}">
				{category ? category : ''}
			</span>
			<span>
				<span class="post-icon">
					{#if accessLevel === 'unlisted'}
						<Fontawesome icon="{faLink}" />
					{:else if accessLevel === 'private'}
						<Fontawesome icon="{faLock}" />
					{/if}
				</span>
				<span
					class="post-date"
				>{dayjs(created).format('YYYY/MM/DD HH:mm')}</span>
			</span>
		</div>
		<h1 class="post-title font serif">{title}</h1>
	</header>
	<article class="post-content-container font sans-serif">
		{@html content}
	</article>
</article>
