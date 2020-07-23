import path from "path";
import webpack from "webpack";

import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";


export const resovle = (...paths: string[]) => path.resolve(__dirname, ...paths)

export default <webpack.Configuration>{
	target: "web",
	stats: "errors-only",
	entry: {
		pageA: "./src/ts/pageA.ts",
		pageB: "./src/ts/pageB.ts",
		pageC: "./src/ts/pageC.ts",
	},
	output: {
		path: resovle("../dist"),
		pathinfo: false,
		publicPath: "./",
		filename: "[name].js",
		//ecmaVersion 默认使用es6打包，对于IE11不支持ES6的浏览器使用ES5打包
		ecmaVersion: 5,
		// assetModuleFilename:"",
	},
	resolve: {
		extensions: ['.ts', '.js'],
		cache: true,
		alias: {
			'@': resovle("../src")
		}
	},
	experiments: {
		topLevelAwait: true,
		importAsync: true,
		importAwait: true,
	},
	optimization: {
		chunkIds: "named",
		splitChunks: {
			chunks: "all",
			minSize: 0,
			cacheGroups: {
				// default: false,
				vendor: {
					test: /test/,
					chunks: 'initial',
					name: 'vendor'
				},
				commons: {
					chunks: "initial",
					minChunks: 2,
					maxInitialRequests: 3,
				}
			}
		}
	},
	//启用打包wasm
	// experiments: {
	// 	syncWebAssembly: true,
	// 	importAsync: true,
	// },
	module: {
		noParse: /dayjs/,
		rules: [
			{
				test: /.tsx?$/i,
				include: resovle("./src"),
				// exclude: /node_modules|mocker/,
				use: [
					'cache-loader',
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
							happyPackMode: true,
							experimentalWatchApi: true,
							compilerOptions: {}
						}
					}
				],

			},
			{
				test: /.styl(\?.*)$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
							importLoaders: 2,
							modules: {
								localIdentName: '[name]_[local]_[hash:base64:6]'
							}
						}
					},
					'postcss-loader',
					{
						loader: 'stylus-loader',
						options: {
							sourceMap: false,
							preferPathResolver: 'webpack',
							use: []
						}
					}
				],
			},
			{
				test: /.css(\?.*)$/i,
				use: ['style-loader', 'css-loader'],
				include: resovle("./src")
			},
			{
				test: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							// limit当小于某KB时转为base64
							limit: 4096,
							fallback: {
								loader: 'file-loader',
								options: {
									name: 'img/[name].[hash:6].[ext]'
								}
							}
						}
					},
				]
			},
			{
				test: /\.(svg)(\?.*)?$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'img/[name].[hash:6].[ext]'
						}
					}
				]
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'PIXI',
			inject: true,
			chunks: [],
			minify: false,
			favicon: "",
			filename: "index.html"
		}),
		new CopyWebpackPlugin({
			patterns: [{
				from: path.resolve(__dirname, "../public"),
				to: ".",
				noErrorOnMissing: true
			}],
		}),
		new ForkTsCheckerWebpackPlugin()
	]
};
