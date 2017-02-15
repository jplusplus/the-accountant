const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json-loader'
        ]
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate-loader',
          'babel-loader'
        ]
      },
      {
        test: /modernizr\.conf\.js$/,
        use: "modernizr-loader"
      },
      {
        test: /.html$/,
        loaders: [
          'html-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, "./modernizr.conf.js")
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => []
      },
      debug: true
    })
  ],
  entry: `./${conf.path.src('index')}`,
  devtool: 'source-map'
};
