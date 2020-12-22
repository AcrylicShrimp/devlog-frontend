const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackSkipAssetsPlugin = require('html-webpack-skip-assets-plugin')
	.HtmlWebpackSkipAssetsPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const config = {
	mode: production ? 'production' : 'development',
	target: 'web',
	entry: {
		index: './app/index.js',
		'ssr-index': './app/ssr-index.js',
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				use: ['babel-loader'],
				exclude: /node_modules/,
			},
			{
				test: /\.(?:html|svelte)$/,
				use: [
					'babel-loader',
					{
						loader: 'svelte-loader',
						options: {
							hydratable: true,
							emitCss: true,
							hotReload: !production,
						},
					},
				],
				exclude: [
					/node_modules[\/\\](?!svelte|@sveltech)/,
					/app[\/\\]index\.html$/,
				],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: !production,
							publicPath: '/',
						},
					},
					'css-loader',
				],
			},
			{
				test: /\.(otf|ttf|eot|woff2?|svg)$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[contenthash].[ext]',
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[id].[contenthash].css',
			chunkFilename: '[name].[id].[contenthash].css',
			ignoreOrder: false,
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'app', 'index.html'),
			inject: true,
			minify:
				(production && {
					removeComments: true,
					collapseWhitespace: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: true,
					minifyCSS: true,
					minifyURLs: true,
				}) ||
				undefined,
			excludeAssets: [/index\.m?js$/],
		}),
		new HtmlWebpackSkipAssetsPlugin(),
		new OptimizeCssAssetsPlugin(),
	],
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte'),
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[name].[id].[contenthash].js',
	},
	devServer: {
		historyApiFallback: true,
	},
};

module.exports = config;
