//webpack 打包分析配置文件
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const config = require('./webpack.prod')
//打包分析
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require("webpack-merge")

module.exports = smp.wrap(merge(config, {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            logLevel: 'info'
        })
    ]
}));
