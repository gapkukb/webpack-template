import webpack from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common";

export default merge(common, <webpack.Configuration>{
    mode: "development",
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: "./dist",
        port: 8080,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: 'ts-loader'
            },
        ]
    }
})
