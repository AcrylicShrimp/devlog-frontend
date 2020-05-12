import * as path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';

const production = process.env.NODE_ENV === 'production';

const config: Configuration = {
	mode: production ? 'production' : 'development',
	target: 'web',
	entry: {
		index: './app/index.ts'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ['babel-loader', 'ts-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.m?js$/,
				use: ['babel-loader'],
				exclude: /node_modules/
			},
			{
				test: /\.(html|svelte)$/,
				use: [
					'babel-loader',
					{
						loader: 'svelte-loader',
						options: Object.assign(
							{
								emitCss: true,
								hotReload: !production,
								externalDependencies: [
									path.resolve(__dirname, 'svelte.config.js')
								]
							},
							require('./svelte.config')
						)
					}
				],
				exclude: [/node_modules\/(?!svelte)/, /app\/index\.html$/]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: !production,
							publicPath: '/'
						}
					},
					'css-loader'
				]
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: !production,
							publicPath: '/'
						}
					},
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
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
					minifyURLs: true
				}) ||
				undefined
		})
	],
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.ts', '.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	}
};

export default config;
