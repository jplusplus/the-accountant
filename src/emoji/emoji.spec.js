import angular from 'angular';
import 'angular-mocks';
import twemoji from 'twemoji';
import emojiFilter from './emoji.filter';

describe('filter: emoji', () => {
  const base = twemoji.base;

  beforeEach(() => {
    angular.module('emoji', []).filter('emoji', emojiFilter);
    angular.mock.module('emoji');
  });

  it('should convert an unicode heart to an image', angular.mock.inject(emojiFilter => {
    const html = emojiFilter('I \u2764 emoji!');
    expect(html).toBe(`I <img class="emoji" draggable="false" alt="\u2764" src="${base}72x72/2764.png"> emoji!`);
  }));
});
