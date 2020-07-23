const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const resolve = (...dir) => path.join(__dirname, '..', ...dir);
exports.resolve = resolve

module.exports = (mode) => {
    const isProd = mode === "development"
    return {
        devtool: 'source-map',
        stats: 'errors-only',
        target: "web",
        entry: "./src/ts/index.ts",
        output: {
            pathinfo: false,
            filename: 'js/[name].[contenthash:6].js',
            path: resolve('../dist'),
            chunkFilename: 'js/[name].[contenthash:6].js',//代码分割的模块命名方式
            publicPath: "",
        },
        externals: {
            //     'jquery': "jQuery"
        },
        resolve: {
            symlinks: false,
            mainFields: [
                'jsnext:main',
                'browser',
                'main'
            ],
            modules: [
                resolve('node_modules'),
                resolve('src'),
            ],
            extensions: ['.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, "../src"),
            },
        },
        module: {
            noParse: /pixi/,
            rules: [
                {
                    test: /\.tsx?$/i,
                    include: resolve("src"),
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            happyPackMode: true,
                            experimentalWatchApi: true,
                            compilerOptions: {}
                        }
                    }
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
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'media/[name].[hash:6].[ext]'
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    use: {
                        loader: 'file-loader',
                        options: {
                            // 保留原文件名和后缀名
                            name: 'fonts/[name].[ext]',
                            // 输出到dist/fonts/目录
                            outputPath: 'fonts',
                        }
                    }
                },
                {
                    test: /worker\.js$/i,
                    use: [
                        {
                            loader: 'worker-loader'
                        }
                    ]
                },
                {
                    test: /worker\.js$/i,
                    use: [
                        {
                            loader: 'worker-loader'
                        }
                    ]
                },
                {
                    test: /\.css$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: false,
                                importLoaders: 2,
                                modules: {
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.styl$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: false,
                                importLoaders: 2,
                                modules: {
                                    localIdentName: '[name]_[local]_[hash:base64:5]'
                                }
                            }
                        },
                        {
                            loader: 'stylus-loader',
                            options: {
                                sourceMap: false,
                                preferPathResolver: 'webpack',
                                use: []
                            }
                        }
                    ]
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                title: "PIXI",
                template: './src/index.html',
                // chunks: ['pixi', 'index'],
                minify: false,
                favicon: "",
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "../public"),
                        to: ".",
                        noErrorOnMissing: true
                    }
                ],
            }),
            new ForkTsCheckerWebpackPlugin()
        ]
    }
}
