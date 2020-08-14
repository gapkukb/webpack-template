const getConfig = env => ({
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "modules": false,
        "corejs": { "version": 3, "proposals": true },
        "loose": false,
        "bugfixes": true,
        "targets": env==='modern'?{esmodules:true}:[
          "> 0.25%",
          "ie >=9",
          "not dead"
        ]
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": true,
      }
    ],
    "babel-plugin-dynamic-import-polyfill",
    "@babel/plugin-proposal-class-properties"
  ]
})

module.exports = {
  env:{
    modern: getConfig('modern'),
    legacy: getConfig('legacy'),
  }
}
