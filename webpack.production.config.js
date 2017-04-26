var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    'sandbox': [
      './client/sandbox'  
    ],
    'app': [
      './client/app'
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.js', '.css'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main', 'index']
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:3000/static/'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
  module: {
    loaders: [{
      test: /\.module\.css$/,
      loaders: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!'
      ]
    },{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'client')
    }]
  }
};
