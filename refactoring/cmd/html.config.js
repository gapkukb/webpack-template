const globalLib = ['global'], glob = require('glob'), path = require('path'), fs = require('fs'), publicPath = './src/template'

const entries = glob.sync(publicPath + "/**/*.{ts,js}").map(item => {
  const repative  = path.relative(publicPath, item), entryName = path.dirname(repative).replace(/[\/\\]+(\w)/g, (x, y) => y.toUpperCase())
  //优先查找pug模板，备用html模板
  const file = item.replace(/\.(js|ts)/, '.pug'), template = fs.existsSync(file) ? file : item.replace(/\.(js|ts)/, '.html')

  return {
    entry: item,
    entryName,
    template,
    title: '模板名称',
    filename: path.dirname(repative)+'/index_new.html',
    chunks: [entryName].concat(globalLib),
    minify: false
  }
})

// const entries = [
//   {
//     entry: './src/index.ts',
//     entryName: 'app',
//     template: './src/index.pug',
//     title: '开发环境',
//     filename: 'index.html',
//     chunks: ['app'].concat(globalLib),
//     minify: false
//   },
// ];

module.exports = entries
