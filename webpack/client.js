const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const devMode = process.env.NODE_ENV == 'development' ? true : false;

//babelOptions
const babelOptions = require('../babel.config');

// common
const common = require('./common');

//alias
let alias = {};
for (let i in common.alias) {
	alias[i] = path.resolve(__dirname, common.alias[i]);
}

const devServer = devMode
	? {
		contentBase: path.join(__dirname, '../dist'), // boolean | string | array, static file location
		compress: true, // enable gzip compression
		historyApiFallback: true, // true for index.html upon 404, object for multiple paths
		hot: true, // hot module replacement. Depends on
		host: '0.0.0.0',
		proxy: {
			'/graphql': 'http://127.0.0.1:4000',
			'/socket.io': 'http://127.0.0.1:4000'
		},
	}
	: {};

const htmlWebpackOptions = devMode
	? {
		initmeta: '<title>xiaokyo</title>',
		initState: '{}',
		filename: 'app.html',
	}
	: {
		initmeta: '<!--meta-->',
		initState: '<!--initState-->',
		filename: 'app.html',
	};

module.exports = {
	mode: process.env.NODE_ENV,
	target: 'web',
	entry: {
		app: [path.join(__dirname, '../src/client/index.js')],
	},
	output: {
		path: path.join(__dirname, '../dist/assets'),
		filename: `${devMode ? '[name].bundle' : '[name].[hash]'}.js`,
		// chunkFilename: 'chunks/[name].[hash].js',
		publicPath: devMode ? '/' : '//cdn.xiaok.club/',
	},
	resolve: {
		alias,
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						...babelOptions,
						plugins: [
							...babelOptions.plugins,
							[
								'import',
								{
									libraryName: 'antd',
									libraryDirectory: 'es',
									style: true, // or 'css'
								},
							],
						],
					},
				},
			},
			{
				// 第三方样式包的处理
				test: /\.(less|css)$/,
				include: /(node_modules)/, //指定文件夹中的样式文件
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							modifyVars: {
								'primary-color': '#e3a86c',
								'link-color': '#e3a86c',
							},
							javascriptEnabled: true,
						},
					},
				],
			},
			{
				test: /\.(less|css)$/,
				exclude: /(node_modules|bower_components)/, //排除文件件
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: common.localIdentName,
							},
						},
					},
					'less-loader',
					'postcss-loader',
				],
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192, //小于8kg的会进行base64的保存方式导出到js
							name: '[hash].[ext]',
						},
					},
				],
			},
		],
	},
	optimization: {
		// minimize: false,
		minimize: devMode ? false : true,
		// namedModules: true,
		// noEmitOnErrors: true,
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /(\.css|\.less)$/,
					chunks: 'all',
					enforce: true
				}
				// commons: {
				//   name: 'vendor',
				//   test: /[\\/]node_modules[\\/]/,
				//   chunks: 'all'
				// }
			}
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			__DEV__: devMode,
			__CLIENT__: true,
		}),
		new HtmlWebpackPlugin({
			...htmlWebpackOptions,
			template: path.join(__dirname, '../public/index.kade'),
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			// filename: `assets/css/${devMode ? '[name]' : '[name].[hash]'}.css`,
			filename: `[name].[hash].css`,
			// chunkFilename: 'assets/css/chunks/[id].css',
			ignoreOrder: true, // Enable to remove warnings about conflicting order
		}),
		new OptimizeCssAssetsPlugin(),
		// new BundleAnalyzerPlugin(),
	],
	// devServer: devServer,
};
