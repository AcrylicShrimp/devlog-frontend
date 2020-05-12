const SveltePreprocess = require('svelte-preprocess');

module.exports = {
	preprocess: SveltePreprocess({
		sass: true,
		babel: true,
		typescript: true
	})
};
