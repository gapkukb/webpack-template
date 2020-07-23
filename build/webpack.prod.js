const webpack = require("webpack")
const path = require("path")
const { merge } = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const common = require("./webpack.common");
/* 压缩css */
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
/* 压缩JS */
const TerserJSPlugin = require("terser-webpack-plugin");
/* 开启GZIP */
const CompressionWebpackPlugin = require('compression-webpack-plugin')
//分包，页面打入多个<script>标签进行引用。对于SplitChunk还是会对基础包进行分析。项目不大可以使用。推荐使用DLLPlugin预编译来自动分包
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

const mode = "production"

const cfg = merge(common(mode), {
    mode,
    //source-map 更好更详细但是文件体积更大
    devtool: 'cheap-module-source-map',
    optimization: {
        runtimeChunk: 'single',
        minimizer: [
            //压缩css
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css\.*(?!.*map)/g,
                cssProcessorOptions: {
                    sourceMap: false,
                    safe: true,
                    //autoprefixer 加好的前缀会被移除掉，这里禁用它以保证前缀不被移除
                    // autoprefixer: { disable: true },
                    autoprefixer: false,
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            }),
            //uglifyJSPlugin不支持es6语法，所以使用TerserJSPlugin压缩
            new TerserJSPlugin({
                cache: false, // 是否缓存,生产环境不需要缓存
                parallel: true, // 是否并行打包，小项目不建议开启，反而会拖慢速度
                sourceMap: true,
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
                use: [
                    //图片压缩
                    {
                        loader: 'image-webpack-loader',
                        //还可以针对每种格式的图片进行不同的设置，
                        //参见  https://www.npmjs.com/package/image-webpack-loader
                        options: {
                            bypassOnDebug: true,
                            disable: true
                        },
                    }
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        //启用Scope Hoisting,生成体积更小运行更快的代码
        new webpack.optimize.ModuleConcatenationPlugin(),
        //如果压缩东西太多影响打包速度，可以考虑使用thread-loader多线程打包
        new CompressionWebpackPlugin({
            test: /\.(js|css|html?)(\?.*)?$/i,//需要压缩的资源的匹配规则.一定不要压缩图片
            filename: '[path].gz[query]',//输出的路径，这里输出到和原始资源同路径
            algorithm: 'gzip', //压缩算法，gzip压缩
            threshold: 1000, //仅处理大于此大小的资源（以字节为单位）10240byte=10.24KB
            minRatio: 0.6, //仅处理压缩率大于此选项的资源
            compressionOptions: { level: 5 }, // 压缩等级1-9，越高越消耗客户端cpu，建议使用5等级
        }),
        //分包，哪些依赖包会被替换成cdn而不被打包
        //由于是手动引入，小项目可以使用，大项目推荐使用webpack.DllPlugin
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'jquery',//包名，如import $ from 'jquery'的jquery
        //             entry: '//unpkg.com/jquery@3.2.1/dist/jquery.min.js', //分包地址
        //             global: 'jQuery',//包的全局变量名称
        //         },
        //     ],
        // }),

        new webpack.EnvironmentPlugin({
            DEBUG: false,
            BASE_URL: "production 默认值",
        }),
        /* 提取css */
        new MiniCssExtractPlugin({
            filename: 'css/app.[contenthash:6].css'
        }),
        /* config.plugin('optimize-css') */
        // new OptimizeCssnanoPlugin({
        //     sourceMap: false,
        //     cssnanoOptions: {
        //         preset: [
        //             'default',
        //             {
        //                 mergeLonghand: false,
        //                 cssDeclarationSorter: false
        //             }
        //         ]
        //     }
        // }),
        new InlineManifestWebpackPlugin('runtime')
    ]
})

module.exports = cfg
