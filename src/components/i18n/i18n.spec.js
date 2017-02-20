import angular from 'angular';
import 'angular-mocks';
import 'angular-translate';
import I18nService from './i18n.service';
import memoizeMixinService from '../memoize/memoize.service';

describe('filter: i18n', () => {
  const fixture = {
    "title@en": "This is a title",
    "title@fr": "C'est un titre",
    "name@en": "This is a name",
    "content@en": "This is a content",
    "body@en": "This is a body",
    "text@en": "This is a text",
    "label@en": "This is a label",
    "foo@en": "Bar"
  };

  let i18n;

  beforeEach(() => {
    angular.module('i18n', ['pascalprecht.translate'])
      .service('memoizeMixin', memoizeMixinService)
      .service('I18n', I18nService);
    angular.mock.module('i18n');
  });

  beforeEach(angular.mock.inject(I18n => {
    i18n = new I18n(fixture);
  }));

  it('should make the given hash translatable for every known fields', () => {
    expect(i18n.title).toBe("This is a title");
    expect(i18n.name).toBe("This is a name");
    expect(i18n.content).toBe("This is a content");
    expect(i18n.body).toBe("This is a body");
    expect(i18n.text).toBe("This is a text");
    expect(i18n.label).toBe("This is a label");
    expect(i18n.foo).toBeUndefined();
  });

  it('should make the given hash translatable and map it', () => {
    expect(i18n.t.title).toBe("This is a title");
    expect(i18n.t.name).toBe("This is a name");
    expect(i18n.t.content).toBe("This is a content");
    expect(i18n.t.body).toBe("This is a body");
    expect(i18n.t.text).toBe("This is a text");
    expect(i18n.t.label).toBe("This is a label");
    expect(i18n.t.foo).toBe("Bar");
  });

  it('should memoize the hash map', angular.mock.inject($translate => {
    const a = i18n.t;
    expect(a).toEqual(i18n.t);
    // Change language
    $translate.use('fr');
    // The hash is no more the same
    expect(a).not.toEqual(i18n.t);
  }));

  it('should get a different title in french', angular.mock.inject($translate => {
    expect(i18n.title).toEqual("This is a title");
    // Change language
    $translate.use('fr');
    // The title is no more the same
    expect(i18n.title).toEqual("C'est un titre");
  }));
});
