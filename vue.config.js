const webpack = require('webpack')
module.exports = {
    //基本路径
    publicPath: './',
    //输出文件目录
    outputDir: 'pack',
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: 'static',
    //生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    lintOnSave: false, //是否禁用eslint
    devServer: {
        overlay: {
            warning: false,
            errors: false
        }
    }
}