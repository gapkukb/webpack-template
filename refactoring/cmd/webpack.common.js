const path = require('path');
const Config = require('webpack-chain');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const util = require('util');
const entries = require('./html.config');
const resolve = (...paths) => path.resolve(__dirname, ...paths);
const assetsPrefix = 'static/';
const jsname = (isProd = false) => `${assetsPrefix}script/[name]${isProd ? '.[contenthash:6]' : ''}.js`;
const cssname = `${assetsPrefix}css/[name].[contenthash:6].css`;
const mediaImgFontName = name => `${assetsPrefix}${name}/[name].[hash:6].[ext]`;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* 开启eslint */
const enableEslint = false;
//环境变量
const ENV_VARS = {
  DEBUG: false,
  MODE: 'UAT',
  CDN: 'abc',
  BASE_URL: undefined,
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
  .path(resolve('../..'))
  .publicPath("/")
  .pathinfo(false)
  .filename(jsname())
  .chunkFilename(jsname())
  .end()
  .target('web')
  .stats('errors-only');

config.resolve.extensions
  .merge(['.ts', '.js', '.tsx', '.jsx', '.json'])
  .end()
  .alias
  .set('@', resolve('../src'))
  .set('@img', resolve('../src/img'))
  .set('@script', resolve('../src/script'))
  .set('@util', resolve('../src/util'))
  .set('@stylus', resolve('../src/stylus'))
  .set("@types", resolve("../src/types"))
  .set("@i18n", resolve("../src/i18n"))
  .set("@include", resolve("../src/template/include"))
  .set('@http', resolve('../src/http'));

config.plugin('copy').use(CopyWebpackPlugin, [
  {
    patterns: [
      {
        from: path.resolve(__dirname, '../public'),
        to: assetsPrefix,
      },
    ],
  },
]);

config.plugin('define').use(require('webpack').EnvironmentPlugin, [ENV_VARS]);
config.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
  {
    filename: cssname,
    chunkFilename: cssname,
  },
]);

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
  // .include.add(resolve('../src'))
  // .end()
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
        name: mediaImgFontName('img'),
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
        name: mediaImgFontName('media'),
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
        name: mediaImgFontName('font'),
      },
    },
  });
/* pug */
config.module
  .rule('pug')
  .test(/\.pug(\?.*)?$/i)
  .use('html')
  .loader('html-loader')
  .options({
    minimize: false
  })
  .end()
  .use('pug')
  .loader('pug-plain-loader')
  .options({
    pretty: true
  })

config.module
  .rule('worker')
  .test(/\.worker\.(j|t)s(\?.*)?$/i)
  .use('worker')
  .loader('worker-loader');

// console.log(util.inspect(config.toConfig(), { showHidden: false, depth: null }));

module.exports.resolve = resolve;
module.exports.common = config;
module.exports.jsname = jsname;
module.exports.assetsPrefix = assetsPrefix;
module.exports.cssname = cssname;
module.exports.extract = (common, open = false) => {
  common.module.rule('stylus').use('postcss').loader('postcss-loader').before('stylus').end().use('extract').loader(MiniCssExtractPlugin.loader).before('css')
  common.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
    {
      filename: cssname,
      chunkFilename: cssname,
    },
  ]);
};
// module.exports = config.toConfig();


