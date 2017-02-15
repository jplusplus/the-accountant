// External modules
import angular from 'angular';
import 'angular-animate';
import 'angular-ui-router';
import 'angular-translate';
import 'angularjs-scroll-glue';
import 'angular-hotkeys';
import 'ng-fittext';
import 'localforage';
import 'angular-localforage';
// Containers
import {main} from './containers/main/main.js';
import {mainDebug} from './containers/main/debug/debug.js';
import {mainToolbar} from './containers/main/toolbar/toolbar.js';
import {mainHints} from './containers/main/hints/hints.js';
import {mainVars} from './containers/main/vars/vars.js';
// Components
import {stack} from './components/stack/stack.js';
import emoji from './components/emoji/emoji.filter.js';
import unsafe from './components/unsafe/unsafe.filter.js';
import explainerFilter from './components/explainer/explainer.filter.js';
import Explainer from './components/explainer/explainer.service.js';
import Game from './components/game/game.service.js';
import I18n from './components/i18n/i18n.service.js';
import Step from './components/step/step.service.js';
import Stack from './components/stack/stack.service.js';
import Slice from './components/slice/slice.service.js';
import Choice from './components/choice/choice.service.js';
import Character from './components/character/character.service.js';
import Ending from './components/ending/ending.service.js';
import Var from './components/var/var.service.js';
// Configurations
import routesConfig from './routes';
import chartConfig from './chart';
import modernizrConfig from './modernizr.js';

// Import SCSS with webpack
import './index.scss';

// For specs
export const app = 'app';

angular
  .module(app, [
    'pascalprecht.translate',
    'ngAnimate',
    'ui.router',
    'luegg.directives',
    'cfp.hotkeys',
    'ngFitText',
    'LocalForageModule'
  ])
  .config(routesConfig)
  .config(chartConfig)
  .run(modernizrConfig)
  .filter('emoji', emoji)
  .filter('unsafe', unsafe)
  .filter('explainer', explainerFilter)
  .service('Explainer', Explainer)
  .service('Game', Game)
  .service('I18n', I18n)
  .service('Step', Step)
  .service('Stack', Stack)
  .service('Slice', Slice)
  .service('Choice', Choice)
  .service('Var', Var)
  .service('Character', Character)
  .service('Ending', Ending)
  .component('main', main)
  .component('mainDebug', mainDebug)
  .component('mainToolbar', mainToolbar)
  .component('mainHints', mainHints)
  .component('mainVars', mainVars)
  .component('stack', stack);
