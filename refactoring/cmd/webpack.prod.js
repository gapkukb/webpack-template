const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const terserWebpackPlugin = require('terser-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const path = require("path")


const ModernModePlugin = require('./plugins');
const util = require('util');
const { resolve, common, jsname, assetsPrefix, cssname, extract } = require('./webpack.common');

/* modern 模式打包时包引用的搜寻顺序 ，legacy 模式反过来*/
const mainFields = ['es2015', 'esm2015', 'fesm2015', 'module', 'jsnext:main', 'esm5', 'fesm5', 'browser', 'main'];

process.env.REQ_URL = 'http://api.github.com';

common.devtool(false).mode('production');

common.output.filename(jsname(true));
common.output.chunkFilename(jsname(true));
common.output.chunkLoadTimeout(20000);
// common.output.publicPath('/' + assetsPrefix)

common.plugin('gzip').use(CompressionWebpackPlugin, [
  {
    test: /\.(js|css|html|svg?)(\?.*)?$/i, //需要压缩的资源的匹配规则.一定不要压缩图片
    filename: '[path].gz[query]', //输出的路径，这里输出到和原始资源同路径
    algorithm: 'gzip', //压缩算法，gzip压缩
    threshold: 1, //仅处理大于此大小的资源（以字节为单位）10240byte=10.24KB
    minRatio: 0.6, //仅处理压缩率大于此选项的资源
    compressionOptions: { level: 5 }, // 压缩等级1-9，越高越消耗客户端cpu，建议使用5等级
  },
]);

common.plugin('ignore-css-effect').use(FixStyleOnlyEntriesPlugin);

// common.plugin('preload').use(PreloadWebpackPlugin, [
//   {
//     rel: 'preload',
//     /* 同步模块走preload */
//     include: 'initial',
//     fileBlacklist: [/\.map$/, /hot-update\.js$/],
//   },
// ]);

// common.plugin('prefetch').use(PreloadWebpackPlugin, [
//   {
//     rel: 'prefetch',
//     /* 异步模块会被 prefetch */
//     include: 'asyncChunks',
//   },
// ]);
common.plugin('clean').use(CleanWebpackPlugin, [{
  cleanOnceBeforeBuildPatterns: [
    path.resolve(common.output.get("path"), assetsPrefix),
    "../node_mdules/.cache"
  ],
  verbose: true,
  dry: false,
  dangerouslyAllowCleanPatternsOutsideProject: true,
}]);

common.module.rule('image').use('image').loader('image-webpack-loader').options({
  bypassOnDebug: true,
});

common.optimization.splitChunks({
  chunks: 'all',
  minSize: 0,
  maxSize: 0,
  minChunks: 2,
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
  automaticNameDelimiter: '-',
  enforceSizeThreshold: 0,
  cacheGroups: {
    helper: {
      test: /babel|core\-js/,
      priority: -5,
      name: 'polyfill',
    },
    defaultVendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true,
    },
  },
});

let babelConfig = isModern => ({
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        modules: false,
        corejs: { version: 3, proposals: true },
        loose: false,
        bugfixes: true,
        targets: isModern ? { esmodules: true } : '> 0%',
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
    'babel-plugin-dynamic-import-polyfill',
    '@babel/plugin-syntax-bigint',
    '@babel/plugin-proposal-class-properties',
  ],
});

module.exports = (env = {}) => {

  const isModern = env.BUILD_TARGET === 'modern';
  let option = { envName: env.BUILD_TARGET || 'legacy' };
  common.module.rule('ts').use('babel').loader('babel-loader').before('ts').options(option);
  common.module.rule('js').use('babel').loader('babel-loader').options(option);
  extract(common,true)
  common.resolve.mainFields.merge(isModern ? mainFields : mainFields.reverse());

  const config = common.toConfig();
  // console.log(util.inspect(option, { showHidden: false, depth: null }));
  return config;
};
