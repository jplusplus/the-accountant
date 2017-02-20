import angular from 'angular';
import 'angular-mocks';
import 'angular-translate';
import I18nService from '../i18n/i18n.service';
import memoizeMixinService from '../memoize/memoize.service';
import CharacterService from './character.service';

describe('filter: character', () => {
  const fixture = {
    mayor: {
      "name@en": "Birgit Meyer",
      "title@en": "The Mayor",
      "title@fr": "Le Maire"
    },
    lawyer: {
      "name@en": "Jamila Ballard",
      "title@en": "Your lawyer",
      "title@fr": "Votre avocat",
      "avatar": "./images/avatars/lawyer.jpg"
    }
  };

  beforeEach(() => {
    angular.module('character', ['pascalprecht.translate'])
      .service('memoizeMixin', memoizeMixinService)
      .service('I18n', I18nService)
      .service('Character', CharacterService);
    angular.mock.module('character');
  });

  it('should create a character with name', angular.mock.inject(Character => {
    const character = new Character(fixture.mayor, 'mayor');
    // Its name must be correct
    expect(character.name).toBe('Birgit Meyer');
    // Its title too
    expect(character.title).toBe('The Mayor');
  }));

  it('should have the provided avatar', angular.mock.inject(Character => {
    const character = new Character(fixture.lawyer, 'lawyer');
    expect(character.avatar).toBe('./images/avatars/lawyer.jpg');
  }));

  it('should have a default avatar', angular.mock.inject(Character => {
    const character = new Character(fixture.mayor, 'mayor');
    expect(character.avatar).toBeDefined();
  }));

  it('should have a different title according to the language', angular.mock.inject((Character, $translate) => {
    const character = new Character(fixture.mayor, 'mayor');
    // Its title must be correct
    expect(character.title).toBe('The Mayor');
    // Change the language
    $translate.use('fr');
    // Its title must be correct
    expect(character.title).toBe('Le Maire');
  }));

  it('should have use english as fallback language', angular.mock.inject((Character, $translate) => {
    const character = new Character(fixture.mayor, 'mayor');
    // Its title must be correct
    expect(character.title).toBe('The Mayor');
    // Change the language
    $translate.use('de');
    // Its title must be correct
    expect(character.title).toBe('The Mayor');
  }));
});
