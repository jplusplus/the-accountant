import angular from 'angular';
import 'angular-mocks';
import 'angular-ui-router';
// Import the whole app
import {gaRun} from './routes';

describe('config: translate', () => {
  let $state;
  let $rootScope;
  let $window;

  function goTo(...rest) {
    $state.go(...rest);
    $rootScope.$digest();
  }

  beforeEach(() => {
    // Create module
    angular.module('app.route', [
      'ui.router'
    ])
    .run(gaRun)
    .config($stateProvider => {
      // Add dummy states
      $stateProvider.state('foo', {url: '/?lang'});
      $stateProvider.state('foo.bar', {});
    });
    // Mock the app
    angular.mock.module('app.route');
  });

  beforeEach(angular.mock.inject($window => {
    $window.ga = angular.noop;
    spyOn($window, 'ga').and.callThrough();
  }));

  beforeEach(angular.mock.inject((_$state_, _$rootScope_, _$window_) => {
    $state = _$state_;
    $rootScope = _$rootScope_;
    $window = _$window_;
  }));

  it("should call google analytics only after a transition", () => {
    expect($window.ga).not.toHaveBeenCalled();
    goTo('foo.bar', {lang: 'en'});
    expect($window.ga).toHaveBeenCalled();
  });
});
