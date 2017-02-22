const conf = require('./gulp.conf');
const isOSX = process.env.TRAVIS_OS_NAME === 'osx';

module.exports = function (config) {
  const configuration = {
    basePath: '../',
    singleRun: true,
    autoWatch: false,
    logLevel: 'INFO',
    junitReporter: {
      outputDir: 'test-reports'
    },
    browsers: ['PhantomJS'].concat(isOSX ? ['Safari'] : []),
    frameworks: [
      'jasmine'
    ],
    files: [
      'node_modules/es6-shim/es6-shim.js',
      conf.path.src('index.spec.js'),
      conf.path.src('**/*.html'),
      {
        pattern: conf.path.src('images/**/*.+(jpg|png|jpeg|svg)'),
        watched: false,
        included: false,
        served: true
      }
    ],
    proxies:  {
      '/images/': 'http://0.0.0.0:9876/base/images/',
      '/locales/': 'http://0.0.0.0:9876/base/locales/'
    },
    preprocessors: {
      [conf.path.src('index.spec.js')]: [
        'webpack'
      ],
      [conf.path.src('**/*.html')]: [
        'ng-html2js'
      ]
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: `${conf.paths.src}/`
    },
    reporters: ['progress', 'coverage', 'coveralls'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    webpack: require('./webpack-test.conf'),
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-junit-reporter'),
      require('karma-coverage'),
      require('karma-coveralls'),
      require('karma-phantomjs-launcher'),
      require('karma-safari-launcher'),
      require('karma-phantomjs-shim'),
      require('karma-ng-html2js-preprocessor'),
      require('karma-webpack')
    ]
  };

  config.set(configuration);
};
