// External modules
import angular from 'angular';
import 'angular-animate';
import 'angular-ui-router';
import 'angular-translate';
import 'angularjs-scroll-glue';
import 'angular-hotkeys';
import 'ng-fittext';
// Internal modules
import {main} from './main/main.js';
import {mainDebug} from './main/debug/debug.js';
import {mainToolbar} from './main/toolbar/toolbar.js';
import {mainHints} from './main/hints/hints.js';
import {mainVars} from './main/vars/vars.js';
import {stack} from './stack/stack.js';
import unsafe from './unsafe/unsafe.filter.js';
import slide from './slide/slide.animation.js';
import Game from './game/game.service.js';
import Hint from './hint/hint.service.js';
import I18n from './i18n/i18n.service.js';
import Step from './step/step.service.js';
import Stack from './stack/stack.service.js';
import Slice from './slice/slice.service.js';
import Choice from './choice/choice.service.js';
import Var from './var/var.service.js';
import Character from './character/character.service.js';
import Ending from './ending/ending.service.js';
import routesConfig from './routes';
import modernizrConfig from './modernizr.js';
// Import SCSS with webpack
import './index.scss';

angular
  .module('app', [
    'pascalprecht.translate',
    'ngAnimate',
    'ui.router',
    'luegg.directives',
    'cfp.hotkeys',
    'ngFitText'
  ])
  .config(routesConfig)
  .run(modernizrConfig)
  .filter('unsafe', unsafe)
  .animation('.slide', slide)
  .service('Game', Game)
  .service('Hint', Hint)
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
