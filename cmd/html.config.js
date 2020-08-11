const globalLib = ['global'];
const entries = [
  {
    entry: './src/view/a/index.ts',
    entryName: 'a',
    template: './src/view/a/index.html',
    title: '开发环境',
    filename: 'index.html',
    chunks: ['a'].concat(globalLib),
  },
  {
    entry: './src/view/b/index.ts',
    entryName: 'b',
    template: './src/view/b/index.html',
    title: '开发环境',
    filename: 'view/b/b.html',
    chunks: ['b'].concat(globalLib),
  },
  {
    entry: './src/view/c/index.ts',
    entryName: 'c',
    template: './src/view/c/index.html',
    title: '开发环境',
    filename: 'view/c/c.html',
    chunks: ['c'].concat(globalLib),
  },
];

module.exports = entries
