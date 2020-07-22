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
        //writeToDisk 写入磁盘。devServer运行在虚拟文件系统，不会在磁盘产生真实的文件。writeToDisk 会改变此规则
        //writeToDisk也可以是函数，通过返回true来决定哪些文件需要写入磁盘  writeToDisk: (filePath) => {
        //    return /superman\.css$/.test(filePath);
        //}
        writeToDisk: true,
        //匹配多个路径到代理，['/auth', '/api']表示同时匹配这两个规则
        /*
            proxy: [{
                context: ['/auth', '/api'],
                target: 'http://localhost:3000',
                ...
            },...其他规则]
        */
        proxy: {
            /* 需要走代理的匹配规则,匹配/api开头的 */
            '/api': {
                /* 代理的目标地址 */
                target: 'http://localhost:3000',
                /* 重写路径，通常是替换掉/api字符，可以是数组 */
                pathRewrite: { '^/api': '' },
                /* 是否支持https加密协议 */
                secure: true,
                //changeOrigin 如果代理的目标对象是域名，需要此支持，如果代理对象是ip地址，则可以忽略
                changeOrigin: true,
                //bypass 更小粒度的控制走代理的规则，
                //返回null或undefined继续使用代理处理请求。
                //返回false以为请求产生404错误。
                //返回字符串则视为代理的目标地址。请求会被转发到该地址
                //通常用于区分api请求和html img等静态资源请求，下面就是当请求地址后缀是html时返回html文件
                //通常情况下，使用‘/api’前缀进行区分后，不需要在通过bypass返回静态资源。可以直接使用
                bypass: function (req, res, proxyOptions) {
                    if (req.headers.accept.indexOf('html') !== -1) {
                        console.log('Skipping proxy for browser request.');
                        return '/index.html';
                    }
                }
            }
        },
        before(app, server, compiler) {
            // 其他中间件之前， 提供执行自定义中间件 . 这里返回自定义数据。'webpack-api-mocker'
            app.get('/some/path', function (req, res) {
                res.json({ custom: 'response' });
            });

        },

    },
    module: {
        rules: [

        ]
    },
    plugins: [
        // // 定义全局变量，打包后直接替换为字符串，number和boolean不用JSON转字符串
        // // 代码中使用 key访问  NODE_ENV . 不推荐此方式
        // new webpack.DefinePlugin({
        //     NODE_ENV: JSON.stringify("/api/smartsecurity"),
        //     BASE_URL: JSON.stringify("/api/smartsecurity"),
        // }),
        // EnvironmentPlugin插件是DefinePlugin的简写方式 代码中使用process.env.NODE_ENV的方式访问
        // 推荐此方式.这里定义的只是默认值，如果process.env切实存在该属性的值，那么会覆盖默认值.比如process.env.DEBUG=false会覆盖下面设置的true
        // EnvironmentPlugin不需要使用JSON.stringify因为它内部已经处理了
        // 如果在捆绑过程中未找到环境变量，并且未提供默认值，则webpack将抛出错误而不是警告。
        // https://www.webpackjs.com/plugins/environment-plugin/
        // webpack已经定义好了 NODE_ENV 属性，不需要再次定义
        new webpack.EnvironmentPlugin({
            DEBUG: true,
            BASE_URL: "默认值",
        }),
        new ForkTsCheckerWebpackPlugin()
    ]
})
