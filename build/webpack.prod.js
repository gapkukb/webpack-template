const webpack = require("webpack")
const path = require("path")
const merge = require("webpack-merge").merge;
const common = require("./webpack.common");
/* 压缩css */
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
/* 压缩JS */
const TerserJSPlugin = require("terser-webpack-plugin");
/* 开启GZIP */
const CompressionWebpackPlugin = require('compression-webpack-plugin')
//分包，页面打入多个<script>标签进行引用。对于SplitChunk还是会对基础包进行分析。项目不大可以使用。推荐使用DLLPlugin预编译来自动分包
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

module.exports = merge(common, {
    //source-map 更好更详细但是文件体积更大
    devtool: 'cheap-module-source-map',
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin({}),
            //uglifyJSPlugin不支持es6语法，所以使用TerserJSPlugin压缩
            new TerserJSPlugin({
                cache: true, // 是否缓存
                parallel: true, // 是否并行打包，小项目不建议开启，反而会拖慢速度
                sourceMap: true,
            })
        ]
    },
    module: {
        rules: [

        ]
    },
    plugins: [
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css|png|jpg|webp)$'),
            threshold: 10240,
            minRatio: 0.8
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
        /*分包 webpack 自带的分包功能，结合webpack.DllPlugin使用，见webpack.libs.ts */
        new webpack.DllReferencePlugin({
            manifest: require(path.resolve(__dirname, '../libs/library.json')),
        })
    ]
})
