const path = require('path');
const gulp = require('gulp');
const conf = require('../conf/gulp.conf');
const htmlbuild = require('gulp-htmlbuild');
const es = require('event-stream');
const ms = require('merge-stream');
const jsdom = require('jsdom').jsdom;
const _ = require('lodash');
const glob = require('glob');
const rename = require("gulp-rename");

gulp.task('i18n:meta', meta);
gulp.task('i18n:index', index);

function translateAttr(block, attr, lang) {
  // Load the locale file
  const locale = require(path.join('..', conf.paths.src, `/locales/${lang}.json`));
  // Iterates over block lines
  return block._lines.map(function (str) {
    // Create a document for this lines
    const window = jsdom(str);
    // Every tags with this attribute
    Array.from(window.querySelectorAll(`[${attr}]`)).forEach(function(meta) {
      // Find the translation within the locale file or use the current valye
      meta[attr] = _.get(locale, meta[attr]) || meta[attr];
    });
    // Return the head of the new document
    return window.head.innerHTML;
  });
}

function meta() {
  const all = glob.sync(path.join(conf.paths.dist, '/locales/*.json')).map(function(file) {
    // Get the lang code from the file name
    const lang = path.basename(file, '.json');
    // Open the index.html
    return gulp.src(path.join(conf.paths.dist, '/index.html'))
      .pipe(htmlbuild({
        meta: function (block) {
          // Create a stream with an array of line from te
          es.readArray(translateAttr(block, block.args[0], lang).map(function (str) {
            return block.indent + str;
          })).pipe(block);
        }
      }))
      .pipe(rename(`${lang}.html`))
      .pipe(gulp.dest(conf.paths.dist));
  });
  return ms(all);
}

function index() {
  return gulp.src(path.join(conf.paths.dist, 'en.html'))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(conf.paths.dist));
}
