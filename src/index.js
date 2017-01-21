// External modules
import angular from 'angular';
import 'angular-animate';
import 'angular-ui-router';
import 'angular-translate';
import 'angularjs-scroll-glue';
import 'angular-hotkeys';
// Internal modules
import {main} from './main/main.js';
import {mainDebug} from './main/debug/debug.js';
import {mainToolbar} from './main/toolbar/toolbar.js';
import {mainVars} from './main/vars/vars.js';
import {slicable} from './slicable/slicable.js';
import unsafe from './unsafe/unsafe.filter.js';
import slide from './slide/slide.animation.js';
import Game from './game/game.service.js';
import Step from './step/step.service.js';
import Slicable from './slicable/slicable.service.js';
import Slice from './slice/slice.service.js';
import Choice from './choice/choice.service.js';
import Var from './var/var.service.js';
import Ending from './ending/ending.service.js';
import routesConfig from './routes';

// Import SCSS with webpack
import './index.scss';

angular
  .module('app', [
    'pascalprecht.translate',
    'ngAnimate',
    'ui.router',
    'luegg.directives',
    'cfp.hotkeys'
  ])
  .config(routesConfig)
  .filter('unsafe', unsafe)
  .animation('.slide', slide)
  .service('Game', Game)
  .service('Step', Step)
  .service('Slicable', Slicable)
  .service('Slice', Slice)
  .service('Choice', Choice)
  .service('Var', Var)
  .service('Ending', Ending)
  .component('main', main)
  .component('mainDebug', mainDebug)
  .component('mainToolbar', mainToolbar)
  .component('mainVars', mainVars)
  .component('slicable', slicable);
