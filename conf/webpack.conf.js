const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const autoprefixer = require('autoprefixer');

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
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /modernizr\.conf\.js$/,
        loader: "modernizr-loader"
      },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { url: false }
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
    new DashboardPlugin({ port: 3030 }),
    new WebpackNotifierPlugin({ title: 'Temptation city' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    FailPlugin,
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer]
      },
      debug: true
    })
  ],
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'index.js'
  },
  entry: `./${conf.path.src('index')}`
};
