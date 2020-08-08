const util = require('util');
const { common } = require('./webpack.common');
const { entries } = require('./html.config');

common.entry('app').add('./src/index.ts');

common.mode('development');

common.devtool('eval-source-map');

common.plugin('html').use(require('html-webpack-plugin'), [
  {
    template: './src/index.html',
    title: '开发环境',
    output: 'index.html',
  },
]);

common.module
  .rule('stylus')
  .use('style-loader')
  .loader('style-loader')
  .before('css-loader')
  .end()
  .uses.delete('postcss-loader')
  .end();

common.devServer.port(8080).contentBase('./dist').hot(true).overlay(true).clientLogLevel('error');

// common.plugin('hmr').use(require('webpack').HotModuleReplacementPlugin)

const config = common.toConfig();

console.log(util.inspect(config, { showHidden: false, depth: null }));

module.exports = config;
