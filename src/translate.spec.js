import angular from 'angular';
import 'angular-mocks';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';
import 'angular-ui-router';
import 'angular-dynamic-locale';
import 'angular-cookies';
// Import the whole app
import {translateRun, translateConfig} from './translate';

describe('config: translate', () => {
  let $state;
  let $rootScope;
  let $translate;
  let tmhDynamicLocale;

  function goTo(...rest) {
    $state.go(...rest);
    $rootScope.$digest();
  }

  beforeEach(() => {
    // Create module
    angular.module('app.translate', [
      'ngCookies',
      'pascalprecht.translate',
      'ui.router',
      'tmh.dynamicLocale'
    ])
    .config(translateConfig)
    .run(translateRun)
    .config(($stateProvider, $translateProvider) => {
      // Add dummy states
      $stateProvider.state('foo', {url: '/?lang'});
      $stateProvider.state('foo.bar', {});
      // Configure languages
      $translateProvider.translations('en', {});
      $translateProvider.translations('fr', {});
      $translateProvider.preferredLanguage('en');
    });
    // Mock the app
    angular.mock.module('app.translate');
  });

  beforeEach(angular.mock.inject((_$state_, _$translate_, _$rootScope_, _tmhDynamicLocale_) => {
    $state = _$state_;
    $translate = _$translate_;
    $rootScope = _$rootScope_;
    tmhDynamicLocale = _tmhDynamicLocale_;
  }));

  it("should use the right language", () => {
    $translate.use('en');
    expect($translate.use()).toBe('en');
    $translate.use('fr');
    expect($translate.use()).toBe('fr');
  });

  it("should use the fallback language", () => {
    $translate.use('en');
    expect($translate.use()).toBe('en');
    $translate.use('it');
    expect($translate.use()).toBe('en');
  });

  it("should use the language even with longer code", () => {
    $translate.use('fr_BE');
    expect($translate.use()).toBe('fr');
    $translate.use('en-UK');
    expect($translate.use()).toBe('en');
  });

  it("should not have a locale defined", () => {
    expect(tmhDynamicLocale.get()).toBeUndefined();
  });

  it("should change the language and the locale as well", () => {
    goTo('foo.bar', {lang: 'en'});
    expect(tmhDynamicLocale.get()).toBe('en');
    goTo('foo.bar', {lang: 'fr'});
    expect(tmhDynamicLocale.get()).toBe('fr');
  });

  it("should use the current language when language unkown", () => {
    $translate.use('en');
    goTo('foo', {lang: 'it'});
    expect(tmhDynamicLocale.get()).toBe('en');
  });
});
