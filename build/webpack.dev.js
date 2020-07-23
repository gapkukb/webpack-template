const webpack = require("webpack");
const merge = require("webpack-merge").merge;
const common = require("./webpack.common");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const mode = "development"
module.exports = merge(common(mode), {
    mode,
    devtool: 'cheap-module-eval-source-map',
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].[contenthash:6].js',
    },
    devServer: {
        contentBase: "./dist",
        port: 8080,
        hot: true,
    },
    module: {
        rules: [

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({
            DEBUG: true,
            BASE_URL: "默认值",
        })
    ]
})
