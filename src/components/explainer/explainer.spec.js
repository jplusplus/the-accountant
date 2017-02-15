import angular from 'angular';
import 'angular-mocks';
import 'angular-translate';
import I18nService from '../i18n/i18n.service';
import ExplainerService from './explainer.service';

describe('filter: explainer', () => {
  let explainer;

  beforeEach(() => {
    angular.module('explainer', ['pascalprecht.translate'])
      .service('I18n', I18nService)
      .service('Explainer', ExplainerService);
    angular.mock.module('explainer');
  });

  beforeEach(angular.mock.inject(Explainer => {
    explainer = new Explainer({
      'title@en': 'Hello there!',
      'body@en': 'This is a very good explainer about how I manage to get a cookie.'
    });
  }));

  it('should make the given eplainer translatable for every known fields', () => {
    expect(explainer.title).toEqual("Hello there!");
    expect(explainer.body).toEqual("This is a very good explainer about how I manage to get a cookie.");
  });

  it('should not find entities in the given text', angular.mock.inject(Explainer => {
    const text = 'I prepared a memo for you on the topic.';
    expect(Explainer.parse(text).length).toEqual(0);
  }));

  it('should find 1 entity in the given text', angular.mock.inject(Explainer => {
    const text = 'I prepared a memo for you on the topic. [Click here to read it|cartel].';
    expect(Explainer.parse(text).length).toEqual(1);
  }));

  it('should find 2 entities in the given text', angular.mock.inject(Explainer => {
    const text = 'I prepared [a memo|cartel] in the [new book|book].';
    expect(Explainer.parse(text).length).toEqual(2);
  }));
});
