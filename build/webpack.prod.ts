import { merge } from "webpack-merge"
import config from './webpack.common'
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import terserWebpackPlugin from "terser-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import CompressionWebpackPlugin from "compression-webpack-plugin";


export default merge(config, {
    mode: "production",
    devtool: 'cheap-module-source-map',
    output: {
        filename: '[name].[contenthash:6].js'
    },
    optimization: {
        innerGraph: true,
        chunkIds: "natural",
        runtimeChunk: 'single',
        minimizer: [
            //@ts-ignore
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css\.*(?!.*map)/g,
                cssProcessorOptions: {
                    sourceMap: false,
                    safe: true,
                    //autoprefixer 加好的前缀会被移除掉，这里禁用它以保证前缀不被移除
                    // autoprefixer: { disable: true },
                    autoprefixer:false,
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            }),
            //@ts-ignore
            new terserWebpackPlugin({
                cache: false, // 是否缓存,生产环境不需要缓存
                parallel: true, // 是否并行打包，小项目不建议开启，反而会拖慢速度
                sourceMap: true,
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        //@ts-ignore
        new CompressionWebpackPlugin({
            test: /\.(js|css|html?)(\?.*)?$/i,//需要压缩的资源的匹配规则.一定不要压缩图片
            filename: '[path].gz[query]',//输出的路径，这里输出到和原始资源同路径
            algorithm: 'gzip', //压缩算法，gzip压缩
            threshold: 1000, //仅处理大于此大小的资源（以字节为单位）10240byte=10.24KB
            minRatio: 0.6, //仅处理压缩率大于此选项的资源
            compressionOptions: { level: 5 }, // 压缩等级1-9，越高越消耗客户端cpu，建议使用5等级
        }),
    ]
})
