var webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ProTable = require('./proTable')
module.exports = {
  outputDir: "./../service/public/assets", //修改 构建包的名字及路径，默认名字是dist
  assetsDir: './write',
  devServer: {
    host:"127.0.0.1",
    port: 8080,
    open: true,
    disableHostCheck: true,
    proxy: ProTable.dev,
  },
  configureWebpack: config => {
    config.resolve = {
      alias: {
        "@image": require("path").resolve(__dirname, "src/assets/images"),
        "@common": require("path").resolve(__dirname, "src/components/common"),
        '@lib': require("path").resolve(__dirname, "src/lib"),
        '@pdf': require("path").resolve(__dirname, "pdfjs-dist"),
      }
    }
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
    )
  },
};