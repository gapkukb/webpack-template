const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const threadLoader = require("thread-loader");
const stylesLoader = require("./styles.loader.config")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
//如果 thread-loader 和 cache-loader 兩個要一起使用的話，請先放 cache-loader 接著是 thread-loader 最後才是 heavy-loader，這樣的順序才可以有最好的效能。
//多线程预热，指定哪些loader需要进行多线程加速。小项目不建议使用，反而会拖慢速度
threadLoader.warmup({
    // pool options, like passed to loader options
    // must match loader options to boot the correct pool
}, [
    // modules to load
    // can be any module, i. e.
    'babel-loader',
    'ts-loader',
    'css-loader',
]);

//如果要兼容IE8这种不支持ES5的浏览器，打这两个补丁 es5-shim.min.js es5-sham.min.js

module.exports = function (mode) {
    const isProd = mode === "development"
    return {
        devtool: 'source-map',
        stats: 'errors-only',
        /* target: 'node' 会将ES模块换成require cjs模块， 且不会打包fs path等node官方包*/
        target: "web",
        /** 多页面入口 */
        // entry: {
        //     "index": "./src/ts/index.ts",
        //     "login": "./src/ts/login.ts"
        // },
        /** 单页配置 */
        entry: "./src/ts/index.ts",
        output: {
            filename: 'js/[name].[contenthash:6].js',
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'js/[name].[contenthash:6].js',//代码分割的模块命名方式
            /** publicPath 静态资源前缀-公共路径,可在生产替换成cdn */
            // publicPath: "",
            //以下library字段用来开发JS库
            // library: '[一般用插件名]',
            // libraryTarget: 'var',   // 多个可选值, 具体参考[官方文档](https://webpack.docschina.org/guides/author-libraries/)
            // libraryExport: 'default',
        },
        //指定外部依赖，被指定的外部依赖即使import也不会被打包进代码中。
        //通常是为了避免使用<script src=""></script>引入外部库后，在模块化开发中再将外部库打包进来
        //key对应的是包的导入名称,value是该包对外暴漏的全局变量名称。
        // externals: {
        //     'jquery': "jQuery"
        // },
        //module模块选项
        module: {
            //webpack不追溯匹配项内部的导入机制，被忽略的对象不应该含有import require define等导入代码
            //用于在大型项目中忽略大型第三方库,提升构建速度
            noParse: /jquery|lodash/,
        },
        //解析规则
        resolve: {
            // 指定node_modules的位置
            modules: [path.resolve(__dirname, 'node_modules')],
            //自动识别后缀名，如import 'index'时会自动按extensions顺序查找index.ts或者index.js.常用的文件后缀靠前
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.wasm'],
            //模块别名，减少搜索层级
            alias: {
                //将src路径全局解析到@符号，会自动计算导入@的文件的位置到src的路径
                '@': path.resolve(__dirname, "../src"),
                //这样可以使用短路径导入 import 'lib/a/b/c' ==> import 'alia'
                'alia': 'lib/a/b/c'
            },
            //packjson指定的入口文件
            // mainFeilds: ['main']
        },
        //优化配置 见 https://imweb.io/topic/5b66dd601402769b60847149
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        // 打包时，文件路径包含jquery会的js会被抽离打包为jquery.js
                        test: /jquery/,
                        name: 'jquery',
                        chunks: 'all'
                    },
                    // 打包时文件路径含有common的css会被抽离打包成style.css 。对多页应用同样有效
                    // 可能会多出一个style.js 这是webpack bug。
                    styles: {
                        test: /[\\/]common[\\/].+\.css$/,
                        name: 'style',
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        module: {
            rules: [
                // {
                //     test: /\.(html)?$/,
                //     loader: 'html-loader',
                // },

                //抛弃 ts-loader 。 使用babel-loader编译ts
                //babel-loader只是去掉ts类型，类型错误也不会报错，而且不支持const enum。看具体情况决定是否使用babel-loader 代替ts-loader
                // {
                //     test: /\.(tsx?|jsx?)$/i,
                //     include: path.resolve(__dirname, '../src'),
                //     //exclude通常不需要和include同时使用
                //     // exclude: /node_modules/,
                //     use: ['thread-loader', "babel-loader?cacheDirectory=true"],
                // },

                /* js jsx*/
                {
                    test: /\.m?jsx?$/i,
                    include: "src",
                    use: [
                        'cache-loader',
                        'babel-loader',
                    ]
                },
                /* ts tsx */
                {
                    test: /\.tsx?$/i,
                    include: "src",
                    use: [
                        'cache-loader',
                        isProd ? 'babel-loader' : '',
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                happyPackMode: false,
                                compilerOptions: {
                                }
                            }
                        }
                    ]
                },
                /* 图片处理 */
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
                /* svg处理 */
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
                /* 媒体文件处理 */
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
                /* fonts */
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
                /* worker */
                {
                    test: /worker\.js$/i,
                    use: [
                        {
                            loader: 'worker-loader'
                        }
                    ]
                }
            ].concat(stylesLoader(mode))
        },
        // webpack所有插件列表，https://webpack.js.org/plugins/i18n-webpack-plugin/。
        plugins: [
            // 自动清空dist目录
            new CleanWebpackPlugin(),
            // 设置html模板生成路径 , 多html则实例化多个HtmlWebpackPlugin
            new HtmlWebpackPlugin({
                filename: 'index.html',
                title: "PIXI",
                template: './src/index.html',
                // chunks 额外注入模块。在多页情况下，分别指明每个html要注入的js/css模块。如果不指定，会汇入所有模块
                // chunks: ['pixi', 'index'],
                minify: false,
                favicon: "",
            }),
            //定义全局模块，就不用在每个模块都import/require了,可以直接使用变量。
            //key是变量  value是导入的模块名.不需要再 import $ from "jquery" 进行导入而直接使用$变量
            //ProvidePlugin 和 externals 配合使用，既可以无需导入使用模块，还能不被打包进代码。但是ProvidePlugin性能成本很高
            //externals不写也可以。ProvidePlugin中的变量不会被压缩混淆
            // new webpack.ProvidePlugin({
            //     $: 'jquery',
            //     jQuery: 'jquery'
            // }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "../public"),
                        to: ".",
                        noErrorOnMissing: true
                    }
                ],
            }),
            new ForkTsCheckerWebpackPlugin({
                tslint: false,
                formatter: 'codeframe',
                checkSyntacticErrors: false
            })
        ]
    }
}
