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

	import dayjs from 'dayjs';

	export let category;
	export let created = Date.now();
	export let title;
	export let content;
</script>

<div class="post-header-container font serif">
	<span class="post-category" class:exists="{category}">
		{category ? category : ''}
	</span>
	<span class="post-date">{dayjs(created).format('YYYY/MM/DD HH:mm')}</span>
</div>
<h1 class="post-title font serif">{title}</h1>
<article class="post-content-container font sans-serif">
	{@html content}
</article>
