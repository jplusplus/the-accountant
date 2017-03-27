const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

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
