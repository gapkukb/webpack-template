import webpack from "webpack";
import { merge } from "webpack-merge";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import cdnConfig from "./cdn.config";
import common, { cdns } from "./webpack.common";

Object.assign(cdns, cdnConfig)

export default merge(common, {
    //source-map 更好更详细但是文件体积更大
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-transform-modules-commonjs'
                        ]
                    }
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-transform-modules-commonjs'
                        ]
                    }
                }, 'ts-loader']
            },
        ]
    },
    plugins: [
        //@ts-ignore
        // new MiniCssExtractPlugin({
        //     filename: 'css/[name].css'
        // }),

    ]
})
