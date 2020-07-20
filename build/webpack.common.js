const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const threadLoader = require("thread-loader");

//多线程预热，指定哪些loader需要进行多线程加速。小项目不建议使用，反而会拖慢速度
threadLoader.warmup({
    // pool options, like passed to loader options
    // must match loader options to boot the correct pool
}, [
    // modules to load
    // can be any module, i. e.
    'babel-loader',
    'css-loader',
]);

//如果要兼容IE8这种不支持ES5的浏览器，打这两个补丁 es5-shim.min.js es5-sham.min.js
const miniLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        publicPath: "../"
    }
}

module.exports = {
    devtool: 'source-map',
    stats: 'errors-only',
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
        /** publicPath 静态资源前缀-公共路径,可在生产替换成cdn */
        // publicPath: "",
    },
    //指定外部依赖，被指定的外部依赖即使import也不会被打包进代码中。
    //通常是为了避免使用<script src=""></script>引入外部库后，在模块化开发中再将外部库打包进来
    //key对应的是包的导入名称,value是该包对外暴漏的全局变量名称。
    // externals: {
    //     'jquery': "jQuery"
    // },
    //模块解析规则
    resolve: {
        //自动识别后缀名，如import 'index'时会自动按extensions顺序查找index.ts或者index.js
        extensions: ['.js', '.ts'],
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
            /* 抛弃 ts-loader 。 使用babel-loader编译ts */
            {
                test: /\.(tsx?|jsx?)$/,
                include: path.resolve(__dirname, '../src'),
                //exclude通常不需要和include同时使用
                // exclude: /node_modules/,
                use: ['thread-loader',"babel-loader?cacheDirectory=true"],
            },
            {
                test: /\.css$/,
                use: [miniLoader, 'css-loader']
            },
            /* 如果是less scss 将stylus-loader改为less-loader sass-loader即可 */
            {
                test: /\.styl$/,
                use: [miniLoader, 'thread-loader','css-loader', 'postcss-loader', 'stylus-loader']
            },
            /* 图片处理 */
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // limit当小于某KB时转为base64
                            limit: 0,
                            name: 'img/[name].[hash:6].[ext]',
                        }
                    },
                    //图片压缩
                    {
                        loader: 'image-webpack-loader',
                        //还可以针对每种格式的图片进行不同的设置，
                        //参见  https://www.npmjs.com/package/image-webpack-loader
                        options: {
                            disable: true, // webpack@2.x and newer
                        },
                    }
                ]
            },
            /* svg处理 */
            {
                test: /\.(svg)(\?.*)?$/,
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
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
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
            /* 字体处理 */
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // 保留原文件名和后缀名
                        name: '[name].[ext]',
                        // 输出到dist/fonts/目录
                        outputPath: 'fonts',
                    }
                }
            },
            /* config.module.rule('pug') */
            {
                test: /\.pug$/,
                oneOf: [
                    /* config.module.rule('pug').rule('pug-vue') */
                    {
                        resourceQuery: /vue/,
                        use: [
                            {
                                loader: 'pug-plain-loader'
                            }
                        ]
                    },
                    /* config.module.rule('pug').rule('pug-template') */
                    {
                        use: [
                            {
                                loader: 'raw-loader'
                            },
                            {
                                loader: 'pug-plain-loader'
                            }
                        ]
                    }
                ]
            },

        ]
    },
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
        /* 提取css */
        new MiniCssExtractPlugin({
            filename: 'css/app.[contenthash:6].css'
        }),
        // // 定义全局变量，打包后直接替换为字符串，number和boolean不用JSON转字符串
        // // 代码中使用 key访问  NODE_ENV
        // new webpack.DefinePlugin({
        //     NODE_ENV: JSON.stringify("/api/smartsecurity"),
        //     BASE_URL: JSON.stringify("/api/smartsecurity"),
        // }),
        // EnvironmentPlugin插件是DefinePlugin的简写方式 代码中使用process.env.NODE_ENV的方式访问
        // 推荐此方式.这里定义的只是默认值，如果process.env切实存在该key的值，那么会覆盖默认值，比如NODE_ENV: "development",但是webpack运行在production那么NODE_ENV就是production
        // EnvironmentPlugin不需要使用JSON.stringify因为它内部已经处理了
        // 如果在捆绑过程中未找到环境变量，并且未提供默认值，则webpack将抛出错误而不是警告。
        // https://www.webpackjs.com/plugins/environment-plugin/
        new webpack.EnvironmentPlugin({
            NODE_ENV: "development",
            DEBUG: false,
            BASE_URL: "/api/smartsecurity",
        })
    ]
}
