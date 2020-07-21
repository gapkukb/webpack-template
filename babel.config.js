module.exports = function (api) {
    api.cache(true)
    const presets = [
        [
            '@babel/preset-env',
            {
                modules: false //false会开启tree-shaking。只针对ES模块，CJS模块不支持
            }
        ],
        '@babel/preset-typescript'
    ]
    const plugins = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        // ['@babel/plugin-proposal-class-properties', { loose: true }]
    ]

    return {
        presets,
        plugins,
        comments: true,
    }
}
