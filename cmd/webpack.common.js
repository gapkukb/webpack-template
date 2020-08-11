const path = require('path');
const Config = require('webpack-chain');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const util = require('util');
const entries = require('./html.config');
const resolve = (...paths) => path.resolve(__dirname, ...paths);
const jsname = (isProd = false) => `assets/script/[path][name]${isProd ? '.[contenthash:6]' : ''}.js`;
const mediaImgFontName = '[name].[hash:6].[ext]';

const publicPath = '';
/* 开启eslint */
const enableEslint = false;
//环境变量
const ENV_VARS = {
  DEBUG: false,
  MODE: 'UAT',
  CDN: 'abc',
  BASE_URL: publicPath,
  REQ_URL: '/api',
  WEB_CODE: 'h5',
};

let config = new Config();
//entries
config.entry('global').add('./src/stylus/global.styl');

entries.forEach(item => {
  config.entry(item.entryName).add(item.entry);
  config.plugin(item.entryName).use(HtmlWebpackPlugin, [item]);
});

config.output
  .path(resolve('../dist'))
  .pathinfo(false)
  .publicPath(publicPath)
  .filename(jsname())
  .chunkFilename(jsname())
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
  .set('@stylus', resolve('../src/stylus'))
  .set('@http', resolve('../src/http'));

config.plugin('copy').use(CopyWebpackPlugin, [
  {
    patterns: [
      {
        from: path.resolve(__dirname, '../public'),
        to: '.',
      },
    ],
  },
]);

config.plugin('define').use(require('webpack').EnvironmentPlugin, [ENV_VARS]);

config.plugin('fork-ts').use(require('fork-ts-checker-webpack-plugin'), [
  {
    eslint: {
      // 显式的声明是否禁用eslint，否则会自动注入eslint
      enabled: enableEslint,
      files: './src/**/*.{ts,tsx}',
    },
    logger: { issues: 'silent' },
  },
]);

config.module.noParse(/dayjs|jquery|mathjs/);

if (enableEslint) {
  // 启用eslint
  config.module
    .rule('eslint')
    .pre()
    .test(/\.jsx?(\?.*)?$/i)
    .include.add(resolve('../src'))
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('eslint')
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
  .use('cache')
  .loader('cache-loader')
  .end()
  .use('ts')
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
  .use('cache')
  .loader('cache-loader');

/* stylus */
config.module
  .rule('stylus')
  .test(/\.(styl|css)(\?.*)?$/i)
  .use('cache')
  .loader('cache-loader')
  .end()
  .use('css')
  .loader('css-loader')
  .end()
  .use('postcss')
  .loader('postcss-loader')
  .end()
  .use('stylus')
  .loader('stylus-loader')
  .options({
    sourceMap: true,
    preferPathResolver: 'webpack',
    import: [
      resolve('../src/stylus/vars.styl'),
      resolve('../src/stylus/bem.styl'),
      resolve('../src/stylus/mixins.styl'),
    ],
  });
/* images */
config.module
  .rule('image')
  .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/i)
  .use('url')
  .loader('url-loader')
  .options({
    limit: 2048,
    fallback: {
      loader: 'file-loader',
      options: {
        esModule: false,
        name: 'assets/img/' + mediaImgFontName,
      },
    },
  });
/* svg */
config.module
  .rule('svg')
  .test(/\.(svg)(\?.*)?$/i)
  .use('file')
  .loader('file-loader')
  .options({
    name: 'img/' + mediaImgFontName,
  });
/* media */
config.module
  .rule('media')
  .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i)
  .use('url')
  .loader('url-loader')
  .options({
    limit: 2048,
    fallback: {
      loader: 'file-loader',
      options: {
        name: 'assets/media/' + mediaImgFontName,
      },
    },
  });
/* font */
config.module
  .rule('font')
  .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
  .use('url')
  .loader('url-loader')
  .options({
    limit: 4096,
    fallback: {
      loader: 'file-loader',
      options: {
        name: 'assets/font/' + mediaImgFontName,
      },
    },
  });
/* pug */
config.module
  .rule('pug')
  .test(/\.pug(\?.*)?$/i)
  .use('raw')
  .loader('raw-loader')
  .end()
  .use('pug')
  .loader('pug-plain-loader');

config.module
  .rule('worker')
  .test(/\.worker\.(j|t)s(\?.*)?$/i)
  .use('worker')
  .loader('worker-loader');

// console.log(util.inspect(config.toConfig(), { showHidden: false, depth: null }));

module.exports.resolve = resolve;
module.exports.common = config;
module.exports.jsname = jsname;
// module.exports = config.toConfig();
