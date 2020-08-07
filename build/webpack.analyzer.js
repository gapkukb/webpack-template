//webpack 打包分析配置文件
//@ts-nocheck
import SpeedMeasurePlugin from "speed-measure-webpack-plugin"
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from "webpack-merge"
import config from './webpack.prod'
// import config from './webpack.dev'

/**
module.exports = new SpeedMeasurePlugin().wrap(config)
 */

module.exports = merge(config, {
    plugins: [
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',
        //     analyzerHost: '127.0.0.1',
        //     analyzerPort: 8888,
        //     reportFilename: 'report.html',
        //     defaultSizes: 'parsed',
        //     openAnalyzer: true,
        //     generateStatsFile: false,
        //     statsFilename: 'stats.json',
        //     logLevel: 'info',
        //     concatenateModules: false,
        // })
    ]
});

