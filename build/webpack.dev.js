const util = require('util');
const { common } = require('./webpack.common');
const { entries } = require('./html.config');

Object.keys(entries).forEach((item) => {
  common.entry(item).add(entries[item]);
});

common.mode('development');

common.devtool('source-map');

common.module
  .rule('stylus')
  .use('style-loader')
  .loader('style-loader')
  .before('css-loader')
  .end()
  .uses.delete('postcss-loader')
  .end();

common.devServer.port(8080).contentBase('./dist').hot(true).overlay(true);

// common.plugin('hmr').use(require('webpack').HotModuleReplacementPlugin)

const config = common.toConfig();

console.log(util.inspect(config, { showHidden: false, depth: null }));

module.exports = config;
