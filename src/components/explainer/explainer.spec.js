import angular from 'angular';
import 'angular-mocks';
import 'angular-translate';
import 'angular-ui-router';
import I18nService from '../i18n/i18n.service';
import memoizeMixinService from '../memoize/memoize.service';
import ExplainerService from './explainer.service';
import explainerFilter from './explainer.filter';

describe('filter: explainer', () => {
  let explainer;

  beforeEach(() => {
    angular.module('explainer', ['pascalprecht.translate', 'ui.router'])
      .service('I18n', I18nService)
      .service('memoizeMixin', memoizeMixinService)
      .service('Explainer', ExplainerService)
      .filter('explainer', explainerFilter)
      .config($stateProvider => {
        $stateProvider
          .state('main', {
            url: '/main/:ref'
          })
          .state('hint', {
            url: '/hint/:ref'
          });
      });
    angular.mock.module('explainer');
  });

  beforeEach(angular.mock.inject(Explainer => {
    explainer = new Explainer({
      'title@en': 'Hello there!',
      'body@en': 'This is a very good explainer about how I manage to get a cookie.'
    }, 'memo');
  }));

  it('should fill text with explainer links', angular.mock.inject($filter => {
    // Get filter as a method
    const filter = $filter('explainer');
    // Transform the text using the filter
    expect(filter('[a memo|memo]')).toEqual('<a href="#!/main/memo">a memo</a>');
    expect(filter('a [memo|memo]')).toEqual('a <a href="#!/main/memo">memo</a>');
  }));

  it('should fill text with explainer link on a custom state', angular.mock.inject($filter => {
    // Get filter as a method
    const filter = $filter('explainer');
    // Transform the text using the filter
    expect(filter('[link|ref]', 'hint')).toEqual('<a href="#!/hint/ref">link</a>');
  }));

  it('should fill text with a link to unkown state', angular.mock.inject($filter => {
    // Get filter as a method
    const filter = $filter('explainer');
    // Transform the text using the filter
    expect(filter('[link|ref]', 'none')).toEqual('<a href="null">link</a>');
  }));

  it('should make the given eplainer translatable for every known fields', () => {
    expect(explainer.title).toEqual("Hello there!");
    expect(explainer.body).toEqual("This is a very good explainer about how I manage to get a cookie.");
  });

  it('should not find entities in the given text', angular.mock.inject(Explainer => {
    const text = 'I prepared a memo for you on the topic.';
    expect(Explainer.parse(text).length).toEqual(0);
  }));

  it('should have specific attributes', angular.mock.inject(Explainer => {
    const explainers = Explainer.parse('I prepared [a memo|memo].');
    expect(explainers[0].needle).toEqual('[a memo|memo]');
    expect(explainers[0].text).toEqual('a memo');
    expect(explainers[0].ref).toEqual('memo');
  }));

  it('should find 1 entity in the given text', angular.mock.inject(Explainer => {
    const text = 'I prepared a memo for you on the topic. [Click here to read it|cartel].';
    expect(Explainer.parse(text).length).toEqual(1);
  }));

  it('should find 2 entities in the given text', angular.mock.inject(Explainer => {
    const text = 'I prepared [a memo|cartel] in the [a book|book].';
    expect(Explainer.parse(text).length).toEqual(2);
  }));
});
