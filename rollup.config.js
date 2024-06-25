const babel = require('@rollup/plugin-babel');
module.exports = {
    input: "./src/index.js",
    output: [
        // 1.cjs -> commonjs
        // 2.esm -> esmodule
        {
            format: "cjs",
            file: "lib/guide-mini-vue.cjs.js"
        },
        {
            format: "es",
            file: "lib/guide-mini-vue.esm.js"
        }
    ],
    plugins:[
        // 不支持ts，需要转换成js
        // 去读取babel.config.js
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
          })
    ]
}