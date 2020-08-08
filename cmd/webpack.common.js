const path = require('path');
const Config = require('webpack-chain');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPathAssetsFix = require('html-webpack-plugin-assets-fix');

const util = require('util');
const { entries, pages } = require('./html.config');
const resolve = (...paths) => path.resolve(__dirname, ...paths);
const publicPath = '/';
/* 开启eslint */
const enableEslint = true;
//环境变量
const ENV_VARS = {
  DEBUG: false,
  MODE: 'UAT',
  CDN: 'abc',
  BASE_URL: publicPath,
};

let config = new Config();

Object.keys(entries).forEach((item) => {
  config.entry(item).add(entries[item]);
});

config.output
  .path(resolve('../dist'))
  .pathinfo(false)
  .publicPath(publicPath)
  .filename('script/[name].js')
  .chunkFilename('script/[name].js')
  .end()
  .target('web')
  .stats('errors-only');

config.resolve.extensions
  .merge(['.ts', '.js', '.tsx', '.jsx', '.json'])
  .end()
  .alias.set('@', resolve('../src'))
  .set('@img', resolve('../src/img'))
  .set('@script', resolve('../src/script'))
  .set('@util', resolve('../src/util'))
  .set('@http', resolve('../src/http'));

// pages.forEach(item => {
//     config
//         .plugin(item.id)
//         .use(HtmlWebpackPlugin, [item])
// })

config.plugin('html').use(HtmlWebpackPlugin, [
  {
    template: './src/view/abc/index.html',
    filename: 'index.html',
  },
]);

config.plugin('copy').use(CopyWebpackPlugin, [
  {
    patterns: [
      {
        from: path.resolve(__dirname, '../public'),
        to: '.',
        noErrorOnMissing: true,
      },
    ],
  },
]);

config.plugin('fork-ts').use(ForkTsCheckerWebpackPlugin);

config.plugin('define').use(require('webpack').EnvironmentPlugin, [ENV_VARS]);

config.plugin('preload').use(PreloadWebpackPlugin, [
  {
    rel: 'preload',
    /* 同步模块走preload */
    include: 'initial',
    fileBlacklist: [/\.map$/, /hot-update\.js$/],
  },
]);

config.plugin('prefetch').use(PreloadWebpackPlugin, [
  {
    rel: 'prefetch',
    /* 异步模块会被 prefetch */
    include: 'asyncChunks',
  },
]);

config.plugin('friendly-error').use(FriendlyErrorsWebpackPlugin, [
  {
    quiet: true,
  },
]);

config.module.noParse(/dayjs|jquery|mathjs/);
/* eslint */
if (enableEslint) {
  config.module
    .rule('eslint')
    .pre()
    .test(/\.(t|j)sx?(\?.*)?$/i)
    .include.add(resolve('../src'))
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('eslint-loader')
    .loader('eslint-loader');
}
/* ts */
config.module
  .rule('ts')
  .test(/\.tsx?(\?.*)?$/i)
  .include.add(resolve('../src'))
  .end()
  .exclude.add(/node_modules/)
  .end()
  .use('cache-loader')
  .loader('cache-loader')
  .end()
  .use('ts-loader')
  .loader('ts-loader')
  .options({
    transpileOnly: true,
    happyPackMode: false,
    experimentalWatchApi: true,
    compilerOptions: {},
  });
/* js */
config.module
  .rule('js')
  .test(/\.jsx?(\?.*)?$/i)
  .include.add(resolve('../src'))
  .end()
  .exclude.add(/node_modules/)
  .end()
  .use('cache-loader')
  .loader('cache-loader');
/* stylus */
config.module
  .rule('stylus')
  .test(/\.(styl|css)(\?.*)?$/i)
  .use('cache-loader')
  .loader('cache-loader')
  .end()
  .use('css-loader')
  .loader('css-loader')
  .end()
  .use('postcss-loader')
  .loader('postcss-loader')
  .end()
  .use('stylus-loader')
  .loader('stylus-loader')
  .options({
    sourceMap: true,
    preferPathResolver: 'webpack',
    import: [
      resolve('../src/stylus/vars.styl'),
      resolve('../src/stylus/mixins.styl'),
      resolve('../src/stylus/bem.styl'),
    ],
  });
/* images */
config.module
  .rule('image')
  .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/i)
  .use('url-loader')
  .loader('url-loader')
  .options({
    limit: 2048,
    fallback: {
      loader: 'file-loader',
      options: {
        esModule: false,
        name: 'img/[name].[hash:8].[ext]',
      },
    },
  });
/* svg */
config.module
  .rule('svg')
  .test(/\.(svg)(\?.*)?$/i)
  .use('file-loader')
  .loader('file-loader')
  .options({
    name: 'img/[name].[hash:8].[ext]',
  });
/* media */
config.module
  .rule('media')
  .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i)
  .use('url-loader')
  .loader('url-loader')
  .options({
    limit: 2048,
    fallback: {
      loader: 'file-loader',
      options: {
        name: 'media/[name].[hash:8].[ext]',
      },
    },
  });
/* font */
config.module
  .rule('font')
  .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
  .use('url-loader')
  .loader('url-loader')
  .options({
    limit: 4096,
    fallback: {
      loader: 'file-loader',
      options: {
        name: 'font/[name].[hash:8].[ext]',
      },
    },
  });
/* pug */
config.module
  .rule('pug')
  .test(/\.pug(\?.*)?$/i)
  .use('raw-loader')
  .loader('raw-loader')
  .end()
  .use('pug-plain-loader')
  .loader('pug-plain-loader');

// config.module
//     .rule('html')
//     .test(/\.html(\?.*)?$/i)
//     .use("html-loader")
//     .loader("html-loader")
//     .options({
//         attrs: ['img:src', 'link:href']
//     })

config.module
  .rule('worker')
  .test(/\.worker\.js(\?.*)?$/i)
  .use('worker-loader')
  .loader('worker-loader');

// console.log(util.inspect(config.toConfig(), { showHidden: false, depth: null }))

module.exports.resolve = resolve;
module.exports.common = config;
// module.exports = config.toConfig()