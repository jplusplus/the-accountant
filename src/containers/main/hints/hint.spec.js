import angular from 'angular';
import 'angular-mocks';
// Import the whole app
import '../../../index';
import {mainHints} from './hints.js';

describe('component: main.hints', () => {
  let $state;
  let $provide;
  let $compile;
  let $rootScope;
  let $controller;
  let game;
  // Demo history
  const HISTORY = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [5, 0], [6, 0], [7, 2], [8, 0]];

  beforeEach(() => {
    // Avoid async load of locales
    angular.module('app').config($translateProvider => {
      $translateProvider.translations('en', {});
      $translateProvider.translations('fr', {});
      $translateProvider.preferredLanguage('en');
    });
    angular.mock.module('app');
  });

  beforeEach(() => {
    // Expose $provide as a service
    angular.module('app').config($provide => {
      $provide.value('$provide', $provide);
    });
  });

  beforeEach(() => {
    angular.mock.inject((_$rootScope_, _$state_, _$provide_, _$controller_, _$compile_, Game) => {
      $state = _$state_;
      $provide = _$provide_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      // Create a party
      game = new Game();
      // And load history
      game.load(HISTORY);
    });
  });

  it('should respond to URL', () => {
    expect($state.href('main.hints', {ref: 'cartel'})).toEqual('#/hints/cartel');
  });

  it('should have no active element', () => {
    // Add a game instance must be binded to main component
    const $scope = angular.extend($rootScope.$new(), {game});
    const element = $compile('<main-hints game="game"></main-hints>')($scope);
    // Apply a digest
    $scope.$digest();
    const activeItems = element[0].getElementsByClassName('main__hints__item--active');
    expect(activeItems.length).toEqual(0);
  });

  it('should have 5 items', () => {
    // Add a game instance must be binded to main component
    const $scope = angular.extend($rootScope.$new(), {game});
    const element = $compile('<main-hints game="game"></main-hints>')($scope);
    // Apply a digest
    $scope.$digest();
    const items = element[0].getElementsByClassName('main__hints__item');
    expect(items.length).toEqual(5);
  });

  it('should have 1 active item', () => {
    // Inject stateParams value for this cartel
    $provide.value('$stateParams', {ref: 'cartel'});
    // Add a game instance must be binded to main component
    const $scope = angular.extend($rootScope.$new(), {game});
    const element = $compile('<main-hints game="game"></main-hints>')($scope);
    // Apply a digest
    $scope.$digest();
    const activeItems = element[0].getElementsByClassName('main__hints__item--active');
    expect(activeItems.length).toEqual(1);
  });

  it('should scroll to the active item', angular.mock.inject(($document, $timeout) => {
    // Inject stateParams value for this cartel
    const $stateParams = {ref: 'cartel'};
    // Add a game instance must be binded to the component
    const ctrl = $controller(mainHints.controller, {$stateParams, $document, $timeout});
    spyOn(ctrl, 'scrollToRef').and.callThrough();
    ctrl.$onInit();
    $timeout.flush();
    expect(ctrl.scrollToRef).toHaveBeenCalled();
  }));

  it('should not scroll to an active', angular.mock.inject(($document, $timeout) => {
    // Inject stateParams value for this cartel
    const $stateParams = {ref: null};
    // Add a game instance must be binded to the component
    const ctrl = $controller(mainHints.controller, {$stateParams, $document, $timeout});
    spyOn(ctrl, 'scrollToRef').and.callThrough();
    ctrl.$onInit();
    $timeout.flush();
    expect(ctrl.scrollToRef).not.toHaveBeenCalled();
  }));
});
