# webpack 常用配置说明

#

## DLLPlugin 和 splitChunks 和 html-webpack-externals-plugin

splitChunks 作用是将第三方的组件拆分出来，打包成一个或几个包，用于长期缓存。这个行为可以在 webpack 中设置并自动完成。

DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。也能将第三方组件拆分出来，打包成一个或几个包，用于长期缓存且能加速打包过程。

DLLPlugin 与 splitChunks 的区别
1.DllPlugin 需要设置打包的配置文件，并先于项目打包将第三方组件打包；然后再打包主项目通过 DLLReferencePlugin 导入之前分离出来的模块
2.DllPlugin 需要手动插入到对应的页面（可以使用 add-asset-html-webpack-plugin 在打包项目的时候自动插入 ）；
3.Dllplugin 内含有的组件在 webpack 打包项目的时候，不经过打包过程。所以能加快打包速度。（这个其实可以使用 webpack 中的 external 来排除打包某些组件，然后通过链接将对应的组件链入页面，达到相同效果）；
4.Dllplugin 打包不会分析代码内部的模块依赖，它方式是全量的引入的，而 splitChunks 可以按需加载地打包。使用 Dllplugin 适用于不依赖其他库而可以独立运行的库

其实看起来，splitChunks 就是 DllPlugin 的自动版本且可以分析模块依赖。

## 分离第三方依赖的 4 种方法

    1. splitChunks(推荐使用).可以通过配置实现细致的分离。将包分离到本地通过script引入

    2. DLLPlugin + DLLReferencePlugin 预编译方案，对于依赖的第三方库，比如vue，vuex等这些不会修改的依赖，我们可以让它和我们自己编写的代码分开打包，这样做的好处是每次更改我本地代码的文件的时候，webpack只需要打包我项目本身的文件代码，而不会再去编译第三方库。原理是先通过DLLPlugin将包打包到本地再通过DLLReferencePlugin插件script引入。缺点：Dllplugin 和 externals均是全量引入，由于不经过webpack，按需加载的福利自然也无法享受到，而且dll对于重复导入的库会重复打包，**此方案适合vue react这类无依赖的，不会轻易变动，且没有模块化的第三方库，如lodash-es支持es模块化按需加载，就不要这么做**。DLL由于是本地文件，也有利于做离线缓存

    3. html-webpack-externals-plugin + html-webpack-plugin + externals,先通过externals设置告知webpack不打包目标库，再通过html-webpack-externals-plugin手动配置要注入的依赖，html-webpack-plugin会自动将配置打包进html同的script标签。优点是html-webpack-externals-plugin和webpack打包的上下文环境无关，可以注入任何库文件甚至是CDN地址，缺点是需要手动配置。

    4. externals + html。此方案是第三点方案的更手动的版本。在HTML文件中，script引入目标库（可以是CDN）。同时通过externals设置告知webpack不打包目标库(这一步可以省略，甚至不需要安装目标包，如果是typescript且不安装包则要安装声明包已获得代码检查能力或者自定义声明文件)
    5. externals + webpack-cdn-plugin。打包忽略并引入CDN

---
1.externals后，目标库会被过滤而不生成代码，所以webpack的externals更适合把第三方库移到CDN上

2.externals比dll处理速度快是因为externals 会完全排除相关依赖(使用externals适合没有引入其他文件的第三方库比如jquery)，即不处理（相当于SVIP直接走了贵宾通道）；而 DllPlugin 需要进行处理（即需要经历webpack的处理流程，只是不去解析对应依赖，但是遇到依赖会去dll文件那里引入）（相当于VIP不需要额外处理只需要跟着走，但是跟非VIP的一样还是走完了整个过程，非VIP则需要进行全套处理
3.dll和splitChunks冲突，不要一起使用

## ts-loader 和 babel-loader 选择。

在大型项目中，ts-loader 由于要同时进行编译和类型校验工作，其中类型检查每次都需要遍历整个文件夹，导致编译速度很慢。
从 babel-loader>@7 开始，babel 提供了 babel/preset-typescript 来编译 ts 文件，其实现原理是直接丢弃 ts 文件中的类型检查功能，转为 js。
由于两者工作机制不同，他们的区别是：

    babel处理速度非常快，但是不支持const enum常量枚举，而且没有了类型检查功能，即使类型错误也不会报错，可以通过再开一个进程使用tsc -w（tsconfig种的noEmit:true禁止生成文件）来并发检查类型，但是tsc报错不会影响babel的成功。

    ts-loader处理速度比较慢，可以通过ts-loader设置compilerOnly:true指定ts-loader不进行类型检查只生成文件，类型检查功能通过fork-ts-checker-webpack-plugin整个插件来并发执行。

    awesome-typescript-loader有点像ts-loader加fork-ts-checker-webpack-plugin。但是作者好几年没有维护了。

---

## optimization 优化选项说明

#### 升级至 webpack4 后，一些默认插件由 optimization 配置替代了，如下：

    1.CommonsChunkPlugin废弃，由 optimization.splitChunks 和 optimization.runtimeChunk 替代，前者拆分代码，后者提取runtime代码。原来的CommonsChunkPlugin产出模块时，会包含重复的代码，并且无法优化异步模块，minchunks的配置也较复杂，splitChunks解决了这个问题；另外，将 optimization.runtimeChunk 设置为true（或{name: “manifest”}），便能将入口模块中的runtime部分提取出来。
    2.NoEmitOnErrorsPlugin 废弃，由 optimization.noEmitOnErrors 替代，生产环境默认开启。
    3.NamedModulesPlugin 废弃，由 optimization.namedModules 替代，生产环境默认开启。
    4.ModuleConcatenationPlugin 废弃，由 optimization.concatenateModules 替代，生产环境默认开启。
    5.optimize.UglifyJsPlugin 废弃，由 optimization.minimize 替代，生产环境默认开启。

#### optimization 还提供了如下默认配置：

```
optimization: {
    minimize: env === 'production' ? true : false, // 开发环境不压缩
    splitChunks: {
        chunks: "async", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(推荐，全部模块)
        minSize: 30000, // 模块超过30k自动被抽离成公共模块
        minChunks: 1, // 如果模块被引用次数>=1次，就会被抽离。
        maxAsyncRequests: 5,  // 异步加载chunk的并发请求数量<=5
        maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
        name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
        automaticNameDelimiter: '~', // 命名分隔符
        cacheGroups: { // 缓存组，会继承和覆盖splitChunks的配置
            default: { // 模块缓存规则，设置为false，默认缓存组将禁用
                minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
                priority: -20, // 优先级。如果一个模块被cacheGroups中多个规则同时匹配，则只会被优先级高的那一个捕获
                reuseExistingChunk: true, // 默认使用已有的模块。即
            },
            vendors: {
                test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
                priority: -10
            }
        }
    }
}
```
代码分割/分离/抽离
=====
当不使用外部插件时，webpack 会把 webpack.config.js 配置文件里每个入口打包一个 [entry].js 文件，这意味着单页面应用（单入口）最终只会打包生成一个 js 文件。而很多情况下，这种处理并不是最佳的处理方式。比如会造成单个 js 文件体积过大，并且每次项目迭代都会造成全量 js 的更新，不能充分利用缓存。所以我们需要按照一些规则，对打包输出的“块”进行拆分，已达到优化性能的目的。
#### splitChunks

splitChunks 是拆包优化的重点。提取被重复引入的文件，单独生成一个或多个文件，这样避免在多入口重复打包文件.
其中 splitChunks 的 chunks 可取值以下：

    1.async：只抽离异步代码
    2.initial：同时打包异步同步，但是异步内部的引入将不再考虑，直接打包一起。
    3.all：分割异步同步代码（需要定义新规则，将同步的代码打包）

splitChunks 的 reuseExistingChunk 可取值以下：

    例子:
    模块示例:
    Chunk 1 (named one): modules A, B, C
    Chunk 2 (named two): modules B, C
    1.true时
    Chunk 1 (named one): modules A
    Chunk 2 (named two): modules B, C
    2.false时
    Chunk 1 (named one): modules A
    Chunk 2 (named two): no modules (removed by optimization)
    Chunk 3 (named one~two): modules B, C


如果你的项目中包含 element-ui 等第三方组件（组件较大），建议单独拆包。如：

```
splitChunks: {
    // ...
    cacheGroups: {
        elementUI: {
            name: "chunk-elementUI", // 单独将 elementUI 拆包
            priority: 15, // 权重需大于其它缓存组
            test: /[\/]node_modules[\/]element-ui[\/]/
        }
    }
}
```

需要注意的地方：

    *cacheGroups会继承和覆盖splitChunks的配置项，但是test、priorty和reuseExistingChunk只能用于配置缓存组

    *cacheGroups里的每项最好都要加上chunks参数，不然可能打包不出想要的东西

    *minSize默认是30KB（这个体积是压缩前的）在小于30kb的情况下一定要设置一个值，否则也有可能打包不出想要的东西，而且该配置项要配置在cacheGroups

    *默认的提取公共模块机制 vendors和default 可能会产生意外的结果，尽量取消默认后的再自定义（在多页面应用中，假设某个页面的css文件重写了样式，就有可能使这个重写流流入公共样式中，在另一个页面被引用而导致布局出错）default:false , vendors: false，也可以重写defautl,vendors



#### runtimeChunk
通常情况下，webpack打包后的chunk内部会含有和其他chunk之间的映射、依赖关系的代码。runtimeChunk 可以将这些chunk之间的映射依赖关系从代码中抽离出来，形成manifest.json的文件来表达映射依赖关系。其实就是单独分离出**webpack**的一些运行文件。

好处是方便我们做文件的持久化缓存。它可以设置多种类型的值，具体可以看这里，其中 single 即将所有 chunk 的运行代码打包到一个文件中，multiple 就是给每一个 chunk 的运行代码打包一个文件。

我们可以配合 InlineManifestWebpackPlugin 插件将运行代码直接内联插入 html 文件中，因为这段代码非常少，这样做可以避免一次请求的开销。

```
var HtmlWebpackPlugin = require('html-webpack-plugin')
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

module.exports = {
  entry: {
    app: 'src/index.js'
  },
  optimization: {
    runtimeChunk: 'single'
    // 等价于
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'fle-cli',
      filename: 'index.html',
      template: 'xxx',
      inject: true,
      chunks: ['runtime', 'app'], // 将runtime插入html中
      chunksSortMode: 'dependency',
      minify: {/* */}
    }),
    //插件一定要HtmlWebpackPlugin之后，否则编译失败
    new InlineManifestWebpackPlugin('runtime')
  ]
}

```
### babel-loader

1.开启按需加载，配置@babel/env的useBuiltIns为'usage'，package.json里写上browserslist就可以了。建议在生产环境使用
2.babel-loader?cacheDirector
3.hard-source-webpack-plugin 提升二次编译速度
4.cache-loader 提升二次编译速度
5.thread-loader 多线程编译
6.happypack 多线程编译


### 常见插件
1. HotModuleReplacementPlugin 模块热更新插件。Hot-Module-Replacement 的热更新是依赖于 webpack-dev-server，后者是在打包文件改变时更新打包文件或者 reload 刷新整个页面，HRM 是只更新修改的部分。HotModuleReplacementPlugin是webpack模块自带的，所以引入webpack后，在plugins配置项中直接使用即可。
2. html-webpack-plugin 生成 html 文件。将 webpack 中entry配置的相关入口 chunk 和 extract-text-webpack-plugin抽取的 css 样式 插入到该插件提供的template或者templateContent配置项指定的内容基础上生成一个 html 文件，具体插入方式是将样式link插入到head元素中，script插入到head或者body中。关于此插件还衍生了许多周边插件
3. clean-webpack-plugin 。 clean-webpack-plugin 用于在打包前清理上一次项目生成的 bundle 文件，它会根据 output.path 自动清理文件夹；这个插件在生产环境用的频率非常高，因为生产环境经常会通过 hash 生成很多 bundle 文件，如果不进行清理的话每次都会生成新的，导致文件夹非常庞大。
4. mini-css-extract-plugin  将 CSS 提取为独立的文件的插件，对每个包含 css 的 js 文件都会创建一个 CSS 文件，支持按需加载 css 和 sourceMap。只能用在 webpack4 中。暂时不支持 HMR
5. purifycss-webpack 清理css重复和未使用的代码，我们希望在生产环境进行去除。
6. optimize-css-assets-webpack-plugin。 减小 css 打包后的体积默认使用cssnano，生产环境推荐
7. terser-webpack-plugin JS压缩，Webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件
8. NoErrorsPlugin 报错但不退出 webpack 进程。编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
9. compression-webpack-plugin  GZIP压缩。所有现代浏览器都支持 gzip 压缩，启用 gzip 压缩可大幅缩减传输资源大小，从而缩短资源下载时间，减少首次白屏时间，提升用户体验。压缩率1-9，推荐使用6
10. DefinePlugin 定义一些全局的变量，我们可以在模块当中直接使用这些变量，无需作任何声明，DefinePlugin 是 webpack 自带的插件。
11. ProvidePlugin 自动加载模块。 任何时候，当 identifier（标识符） 被当作未赋值的变量时， module 就会自动被加载，并且 identifier 会被这个 module 输出的内容所赋值。这是 webpack 自带的插件。
12. DLLPlugin 这是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 DLLReferencePlugin 映射到相关的依赖上去的。
13. HappyPack 。HappyPack 能让 webpack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。要注意的是 HappyPack 对 file-loader、url-loader 支持的不友好，所以不建议对该 loader 使用
14. copy-webpack-plugin。我们在 public/index.html 中引入了静态资源，但是打包的时候 webpack 并不会帮我们拷贝到 dist 目录，因此 copy-webpack-plugin 就可以很好地帮我做拷贝的工作了。
15. IgnorePlugin 这是 webpack 内置插件，它的作用是：忽略第三方包指定目录，让这些指定目录不要被打包进去。
比如我们要使用 moment 这个第三方依赖库，该库主要是对时间进行格式化，并且支持多个国家语言。虽然我设置了语言为中文，但是在打包的时候，是会将所有语言都打包进去的。这样就导致包很大，打包速度又慢。对此，我们可以用 IgnorePlugin 使得指定目录被忽略，从而使得打包变快，文件变小。如果需要使用被忽略的路径中的模块，需要在代码中显示导入








----
[淘宝团队webpack splitChunk优化文章](https://juejin.im/post/5edd942af265da76f8601199)
----


