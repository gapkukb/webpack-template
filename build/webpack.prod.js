const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const terserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const util = require('util');
const { resolve, common } = require('./webpack.common');

common.output
  .filename('js/[name].[contentHash:6].js')
  .end()
  .devtool(false)
  .mode('production');
common.module
  .rule('stylus')
  .use('extract-loader')
  .loader(MiniCssExtractPlugin.loader)
  .before('css-loader')
  .end()
  .uses.delete('cache-loader')
  .end()
  .end();

common.module
  .rule('ts')
  .use('babel-loader')
  .loader('babel-loader')
  .before('ts-loader');

common.module
  .rule('js')
  .test(/\.jsx?/)
  .include.add(resolve('../src'))
  .end()
  .exclude.add(/node_modules/)
  .end()
  .use('cache-loader')
  .loader('cache-loader')
  .end()
  .use('babel-loader')
  .loader('babel-loader');

common.module
  .rule('images')
  .use('image-webpack-loader')
  .loader('image-webpack-loader')
  .options({
    bypassOnDebug: true,
  });

common
  .plugin('gzip')
  .use(CompressionWebpackPlugin, [
    {
      test: /\.(js|css|html|svg?)(\?.*)?$/i, //需要压缩的资源的匹配规则.一定不要压缩图片
      filename: '[path].gz[query]', //输出的路径，这里输出到和原始资源同路径
      algorithm: 'gzip', //压缩算法，gzip压缩
      threshold: 1, //仅处理大于此大小的资源（以字节为单位）10240byte=10.24KB
      minRatio: 0.6, //仅处理压缩率大于此选项的资源
      compressionOptions: { level: 5 }, // 压缩等级1-9，越高越消耗客户端cpu，建议使用5等级
    },
  ])
  .end()
  .plugin('clean')
  .use(CleanWebpackPlugin)
  .end()
  .plugin('MiniCssExtractPlugin')
  .use(MiniCssExtractPlugin, [
    {
      filename: 'css/app.[contenthash:6].css',
    },
  ]);

const config = common.toConfig();

console.log(util.inspect(config, { showHidden: false, depth: null }));

module.exports = config;
