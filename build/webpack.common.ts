import webpack from "webpack";
import path from "path"
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
//如果要兼容IE8这种不支持ES5的浏览器，打这两个补丁 es5-shim.min.js es5-sham.min.js
const miniLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        publicPath: "../"
    }
}
export const cdns = {
    css: [],
    js: []
}
export default <webpack.Configuration>{
    devtool: 'source-map',
    stats: 'errors-only',
    target: "web",
    /** 多页面入口 */
    entry: {
        "index": "./src/ts/index.ts",
        "login": "./src/ts/login.ts"
    },
    /** 单页配置 */
    //entry: "./src/ts/index.ts",
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist'),
        /** publicPath 静态资源前缀-公共路径,可在生产替换成cdn */
        // publicPath: "",
    },
    //指定外部依赖，被指定的外部依赖即使import也不会被打包进代码中。
    //通常是为了避免使用<script src=""></script>引入外部库后，在模块化开发中再将外部库打包进来
    //key对应的是包的导入名称,value是该包对外暴漏的全局变量名称。
    externals: {
        'jquery': "jQuery"
    },
    resolve: {
        extensions: [],
        alias: {
            //将src路径全局解析到@符号，会自动计算导入@的文件的位置到src的路径
            '@': path.resolve(__dirname, "../src"),
            //这样可以使用短路径导入 import 'lib/a/b/c' ==> import 'alia'
            'alia': 'lib/a/b/c'
        }
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
            {
                test: /\.(html)?$/,
                loader: 'html-loader',
            },

            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: [miniLoader, 'css-loader']
            },
            /* 如果是less scss 将stylus-loader改为less-loader sass-loader即可 */
            {
                test: /\.styl$/,
                use: [miniLoader, 'css-loader', 'postcss-loader', 'stylus-loader']
            },
            /* 图片处理 */
            {
                test: /\.(png|svg|jpg|gif|webp)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 图片输出的实际路径(相对于dist)
                            outputPath: 'img',
                            // 当小于某KB时转为base64
                            limit: 0,
                            name: '[name].[ext]',
                        }
                    }
                ]
            },
            /* 字体处理 */
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // 保留原文件名和后缀名
                        name: '[name].[ext]',
                        // 输出到dist/fonts/目录
                        outputPath: 'fonts',
                    }
                }
            }
        ]
    },
    plugins: [
        // 自动清空dist目录
        new CleanWebpackPlugin(),
        // 设置html模板生成路径
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: "PIXI",
            template: './src/htmls/index.ejs',
            // chunks 额外注入模块。在多页情况下，分别指明每个html要注入的js/css模块。如果不指定，会汇入所有模块
            // chunks: ['pixi', 'index'],
            minify: false,
            favicon: "",
            //除了在output.public中指定cdn，还可以在此额外指定css/js cdn
            cdns: cdns
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/htmls/login.ejs',
            // chunks: ['pixi', 'login']
        }),
        //定义全局变量，就不用在每个模块都import/require了,可以直接使用变量。
        //key是变量  value是导入的模块名.不需要再 import $ from "jquery" 进行导入而直接使用$变量
        //ProvidePlugin 和 externals 配合使用，既可以无需导入使用模块，还能不被打包进代码。但是ProvidePlugin性能成本很高
        //externals不写也可以。ProvidePlugin中的变量不会被压缩混淆
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
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
        new MiniCssExtractPlugin({
            filename: 'css/app.css'
        }),
    ]

}
