// External modules
import 'babel-polyfill';
import angular from 'angular';
import 'angular-animate';
import 'angular-cookies';
import 'angular-dynamic-locale';
import 'angular-hotkeys';
import 'angular-localforage';
import 'angular-marked';
import 'angular-scroll';
import 'angular-socialshare';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';
import 'angular-ui-router';
import 'angularjs-scroll-glue';
import 'ng-fittext';
import localforage from 'localforage';
import 'c3-angular';
import 'marked';
// Containers
import {main} from './containers/main/main.js';
import {mainToolbar} from './containers/main/toolbar/toolbar.js';
import {mainHints} from './containers/main/hints/hints.js';
import {mainVars} from './containers/main/vars/vars.js';
import {mainPage} from './containers/main/page/page.js';
// Components
import {stack} from './components/stack/stack.js';
import {chart} from './components/chart/chart.js';
// Filters
import emoji from './components/emoji/emoji.filter.js';
import unsafe from './components/unsafe/unsafe.filter.js';
import explainerFilter from './components/explainer/explainer.filter.js';
// Services
import Explainer from './components/explainer/explainer.service.js';
import Game from './components/game/game.service.js';
import I18n from './components/i18n/i18n.service.js';
import memoizeMixin from './components/memoize/memoize.service.js';
import Step from './components/step/step.service.js';
import Stack from './components/stack/stack.service.js';
import Slice from './components/slice/slice.service.js';
import Chart from './components/chart/chart.service.js';
import Choice from './components/choice/choice.service.js';
import Character from './components/character/character.service.js';
import Ending from './components/ending/ending.service.js';
import Var from './components/var/var.service.js';
// Configurations
import {routesConfig, gaRun} from './routes';
import chartRun from './chart';
import markedConfig from './marked.js';
import modernizrRun from './modernizr.js';
import {translateConfig, translateRun} from './translate.js';
// Import SCSS with webpack
import './index.scss';
// For specs
export const app = 'app';
// Fix an issue with localforage when the app is executed from an iframe
// @see https://github.com/localForage/localForage/issues/631#issuecomment-267265554
localforage.ready().catch(angular.noop);

angular
  .module(app, [
    'ngAnimate',
    'ngCookies',
    'hc.marked',
    'pascalprecht.translate',
    'ui.router',
    'luegg.directives',
    'cfp.hotkeys',
    'ngFitText',
    'LocalForageModule',
    'gridshore.c3js.chart',
    'duScroll',
    'tmh.dynamicLocale',
    '720kb.socialshare'
  ])
  .config(routesConfig)
  .config(translateConfig)
  .config(markedConfig)
  .run(gaRun)
  .run(chartRun)
  .run(modernizrRun)
  .run(translateRun)
  .filter('emoji', emoji)
  .filter('unsafe', unsafe)
  .filter('explainer', explainerFilter)
  .service('Explainer', Explainer)
  .service('Game', Game)
  .service('I18n', I18n)
  .service('memoizeMixin', memoizeMixin)
  .service('Step', Step)
  .service('Stack', Stack)
  .service('Slice', Slice)
  .service('Chart', Chart)
  .service('Choice', Choice)
  .service('Var', Var)
  .service('Character', Character)
  .service('Ending', Ending)
  .component('main', main)
  .component('mainToolbar', mainToolbar)
  .component('mainHints', mainHints)
  .component('mainVars', mainVars)
  .component('mainPage', mainPage)
  .component('stack', stack)
  .component('chart', chart);
