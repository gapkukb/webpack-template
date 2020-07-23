export default {}
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// //样式loader汇总
// module.exports = function (mode) {
//     const isProd = mode === "development"
//     //开启多进程打包，小项目不要使用，会适得其反
//     const openThreadLoader = true
//     //开发环境使用style-loader，不提取css到统一文件
//     const diffLoader = !isProd ? 'style-loader' : {
//         loader: MiniCssExtractPlugin.loader,
//         options: {
//             hmr: !isProd,
//             publicPath: "../"
//         }
//     }
//     const baseConfig = [diffLoader, openThreadLoader ? 'thread-loader' : '', {
//         loader: 'css-loader',
//         options: {
//             sourceMap: false,
//             importLoaders: 2,
//             modules: {
//                 localIdentName: '[name]_[local]_[hash:base64:5]'
//             }
//         }
//     }]
//     //postcss-loader选项在package.json里
//     const preStyleConfig = Array.from(baseConfig).concat('postcss-loader')
//     return [
//         /* css */
//         {
//             test: /\.css$/i,
//             use: baseConfig
//         },
//         /* postcss */
//         {
//             test: /\.p(ost)?css$/i,
//             use: preStyleConfig
//         },
//         /* stylus */
//         {
//             test: /\.styl$/i,
//             use: preStyleConfigArray.from(preStyleConfig).concat({
//                 loader: 'stylus-loader',
//                 options: {
//                     sourceMap: false,
//                     preferPathResolver: 'webpack',
//                     use: []
//                 }
//             })
//         },
//         /* scss */
//         {
//             test: /\.scss$/i,
//             use: Array.from(preStyleConfig).concat({
//                 loader: 'sass-loader',
//                 options: {
//                     sourceMap: false,
//                 }
//             })
//         },
//         /* sass */
//         {
//             test: /\.sass$/i,
//             use: Array.from(preStyleConfig).concat({
//                 loader: 'sass-loader',
//                 options: {
//                     sourceMap: false,
//                     sassOptions: {
//                         indentedSyntax: true
//                     }
//                 }
//             })
//         },
//         /* less处理 */
//         {
//             test: /\.less$/,
//             use: Array.from(preStyleConfig).concat({
//                 loader: 'less-loader',
//                 options: {
//                     sourceMap: false,
//                     modifyVars: {
//                         hack: 'true; @import "C:\\workspace\\smart_school\\src\\styles\\theme.less"'
//                     }
//                 }
//             })
//         },
//     ]
// }
