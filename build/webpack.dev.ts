import { merge } from "webpack-merge"
import config from './webpack.common'
import webpack from "webpack";
import mockerApi from "mocker-api";
import path from "path";
import { resovle } from "./webpack.common"

export default merge(config, {
    mode: "development",
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: "./dist",
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        before(app) {
            mockerApi(app, path.resolve('./src/mocker/index.js'), {
                proxy: {
                    //@ts-ignore
                    '/^api/': 'http://127.0.0.1:2018',

                },
                pathRewrite: {
                    //@ts-ignore
                    '/^api/': '',
                },
                changeHost: true,
            })
        },

    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
})
