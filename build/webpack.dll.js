//分包可以理解为使用script进行cdn加载。减小打包体积和提高访问速度
/* 此配置用来生成分包json，从而自动加载 */
const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const { resolve } = require('./webpack.common')

// const filename =  '[name]_[hash].js'
const filename = '[name]'
module.exports = {
    mode: 'production',
    entry: {
        //匹配规则，哪些库需要被分包，多个规则会生成多个包,下面就会生成两个dll.js和两个dll.json。分别包含各自制定的库
        vue: [
            'vue',
            'vuex',
            'vue-router',
        ],
        react: [
            'react',
            'redux',
            'react-router',
        ],
    },
    output: {
        filename: '[name].dll.js',
        //路径不要存在dist中(假如你的生产代码是编译在dist文件夹的话)，否则会被cleanwebpackplugin清理
        path: resolve('dll'),
        //库名，按原库名导出
        library: '[name]'
    },
    plugins: [
        new CleanWebpackPlugin(),
        //使用DllPlugin生成JSON
        new webpack.DllPlugin({
            name: '[name]',
            path: resolve('dll/[name].manifest.json'),
        })
    ]
}
