// External modules
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
// Internal modules
import {main} from './main/main.js';
import Game from './game/game.service.js';
import Step from './step/step.service.js';
import Choice from './choice/choice.service.js';
import Var from './var/var.service.js';
import Ending from './ending/ending.service.js';
import routesConfig from './routes';

// Import SCSS with webpack
import './index.scss';

angular
  .module('app', [
    'pascalprecht.translate',
    'ui.router'
  ])
  .config(routesConfig)
  .service('Game', Game)
  .service('Step', Step)
  .service('Choice', Choice)
  .service('Var', Var)
  .service('Ending', Ending)
  .component('main', main);
