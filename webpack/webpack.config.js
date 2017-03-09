var webpack = require('webpack');
var author=new webpack.BannerPlugin('This file is created by liyang');
module.exports = {
  //插件项

  plugins: [author],
  //页面入口文件配置
  entry: './entry.js',
  //入口文件输出配置(__dirname是当前路径)
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    //加载器配置
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}
