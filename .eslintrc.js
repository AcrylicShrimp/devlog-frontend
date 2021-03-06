module.exports = {
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module'
	},
	env: {
		es6: true,
		node: true,
		browser: true,
	},
	plugins: ['svelte3'],
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3'
		}
	],
	rules: {
		quotes: [1, 'single', { avoidEscape: true }]
	},
	settings: {
		'svelte3/ignore-styles': (style) =>
			style.lang !== undefined || style.lang !== 'css'
	}
};
