const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const autoprefixer = require('autoprefixer');

// Create multiple instances
const extractCSS = new ExtractTextPlugin('[name].css');

module.exports = {
  module: {
    noParse: [
      /localforage\.js$/,
    ],
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
        test: /modernizr\.conf\.js$/,
        use: "modernizr-loader"
      },
      {
        test: /\.scss$/i,
        use: extractCSS.extract({
          loader: [{
            loader: "css-loader?url=false"
          }, {
            loader: "sass-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
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
      },
      {
        test: /\.(jpeg|jpg|png|gif|svg|eot|svg|ttf|woff|woff2)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }]
      }
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, "./modernizr.conf.js"),
      images: path.join(process.cwd(), conf.path.src('images'))
    }
  },
  plugins: [
    new DashboardPlugin({ port: 3030 }),
    new WebpackNotifierPlugin({ title: 'Temptation city' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    FailPlugin,
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),
    extractCSS,
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
