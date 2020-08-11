const util = require('util');
const { resolve, common } = require('./webpack.common');
const { entries } = require('./html.config');
const apiMocker = require('mocker-api');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssname = 'css/[name].[contenthash:6].css';
let enableMocker = false;
let devServer;
class HtmlHotReload {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
        'MyPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          devServer.sockWrite(devServer.sockets, 'content-changed');
          cb(null, data);
        },
      );
    });
  }
}

common.mode('development');

common.devtool('eval-source-map');

common.devServer
  .port(8080)
  .contentBase(path.join(__dirname, 'assets'))
  .hot(true)
  .overlay(true)
  .clientLogLevel('error')
  .before((app, server) => {
    devServer = server;
    if (enableMocker) {
      apiMocker(app, resolve('../mocker/index.js'), {
        proxy: {
          '/api/(.*)': 'https://postman-echo.com',
        },
        pathRewrite: {
          '^/api/': '/',
        },
        secure: true,
        changeHost: true,
      });
    }
  });

common.plugin('html-hot').use(HtmlHotReload);

module.exports = (env = {}) => {
  if(env.css==="ie"){
    common.module.rule('stylus').use('mini').loader(MiniCssExtractPlugin.loader).before('css').end().uses.delete('cache');

    common.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
      {
        filename: cssname,
        chunkFilename: cssname,
      },
    ]);

  }else{
    common.module.rule('stylus').use('style').loader('style-loader').before('css').end().uses.delete('postcss').end();
  }


  const config = common.toConfig();
  // console.log(util.inspect(config, { showHidden: false, depth: null }));
  return config;
};
