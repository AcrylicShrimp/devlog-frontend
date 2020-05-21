<style>
	.post-header-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.post-category {
		padding-left: 12px;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 18px;
		color: #727272;
		visibility: hidden;
	}

	.post-category.exists {
		visibility: unset;
	}

	.post-date {
		font-family: 'Nanum Myeongjo', serif;
		font-size: 18px;
		color: #727272;
	}

	.post-title {
		margin: 0;
		margin-top: 32px;
		font-family: 'Nanum Myeongjo', serif;
		font-size: 34px;
		font-size: bold;
		color: #404040;
	}

	.post-content-container {
		margin-top: 30px;
	}
</style>

<script>
	import 'font-awesome/css/font-awesome.css';

	import './halflife.css';
	import './Post.css';

	import dayjs from 'dayjs';

	export let category;
	export let created = Date.now();
	export let title;
	export let content;
</script>

<div class="post-header-container">
	<span class="post-category" class:exists="{category}">
		{category ? category : ''}
	</span>
	<span class="post-date">{dayjs(created).format('YYYY/MM/DD HH:mm')}</span>
</div>
<h1 class="post-title">{title}</h1>
<article class="post-content-container">
	{@html content}
</article>
