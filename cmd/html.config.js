const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');
const root = './src/view/';
let entries = {},
  pages = [];
glob.sync(root + '**/*.{js,ts}').forEach((item) => {
  let name = path
    .relative(root, item)
    .replace(path.sep, '_')
    .replace(/\.(ts|js)$/, '');
  let temp = item.replace(/\.ts|\.js$/, '.html');
  entries[name] = item;
  pages.push({
    id: item,
    template: temp,
    title: '',
    chunks: ['jquery', name],
    filename: temp.replace('src/', ''),
  });
}, {});

// console.log(pages);
module.exports.pages = pages;
module.exports.entries = entries;
