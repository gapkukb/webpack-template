module.exports = function (api) {
    api.cache(true)
    if (process.env["ENV"] === "prod") {
        //... 环境区分
    }
    const presets = [
        [
            "@babel/preset-env",
            {
                //按需加载.会自动注入依赖（垫片），这里是在全局范围内添加垫片，污染全局
                //@babel/plugin-transform-runtime中不在全局范围的情况下添加它们。不会污染全局，但是无法指定浏览器兼容。
                "useBuiltIns": "usage",
                //打包输出加载了哪些垫片库
                // debug: true,
                "modules": false, //false会开启tree-shaking。只针对ES模块，CJS模块不支持
                //babel 7.4.0以后不建议使用@babel/polyfill,默认使用corejs2,如果要使用最新激进的es语法，使用core-js@3版本
                "corejs": 3,
                "loose": false,
            }
        ],
    ]
    const plugins = [
        [
            //@babel/plugin-transform-runtime可以抛开@babel/preset-env单独使用，并且比单独使用@babel/preset-env小很多。
            //但是babel-runtime有个缺点，它不模拟实例方法，即内置对象原型上的方法，
            //所以类似Array.prototype.find，你通过babel-runtime是无法使用的，这只能通过 babel-polyfill 来转码
            //如果是开发应用则配合@babel/preset-env使用，开发类库（不考虑兼容）可以单独使用@babel/plugin-transform-runtime

            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                //不能同时在@babel/plugin-transform-runtime和@babel/preset-env中指定corejs，两者互相独立会造成重复引入臃肿
                //建议开发应用使用@babel/preset-env中的corejs选项，关闭@babel/plugin-transform-runtime中的corejs选项，只使用helper注入
                //建议开发类库供别人使用，则和上面配置相反。并安装 @babel/runtime-corejs3 依赖
                "corejs": false,
                //是否将内联的 babel helpers 代码抽离到单独的 module 文件，避免内联的 helper 代码在多个文件重复出现。
                "helpers": true,
                //默认情况下回根据 browserslist 来确认是否转化 generator 函数 或 async 函数 箭头函数
                "regenerator": true,
                //useESModules:boolean = false (推荐 true)
                //启用时将会加载 esModules 规范的 helpers 函数代码，这样webpack构建出来的代码会更小，因为这无需保留commonjs语义
                "useESModules": true
            }
        ],
        'babel-plugin-dynamic-import-polyfill',
    ]

    return {
        presets,
        plugins,
        comments: true,
    }
}
