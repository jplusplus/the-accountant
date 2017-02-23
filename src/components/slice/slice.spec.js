import angular from 'angular';
import 'angular-mocks';
import 'angular-translate';
import memoizeMixinService from '../memoize/memoize.service';
import I18nService from '../i18n/i18n.service';
import SliceService from './slice.service';

describe('service: slice', () => {
  let Slice;

  beforeEach(() => {
    angular.module('slice', ['pascalprecht.translate'])
      .service('memoizeMixin', memoizeMixinService)
      .service('I18n', I18nService)
      .service('Slice', SliceService);
    angular.mock.module('slice');
  });

  beforeEach(angular.mock.inject(_Slice_ => {
    Slice = _Slice_;
  }));

  it('should have index', () => {
    const slice = new Slice({});
    expect(slice.index).toBe(0);
  });

  it('should not have index', () => {
    const slice = new Slice({}, {slices: []});
    expect(slice.index).toBe(-1);
  });

  it('should be you', () => {
    const slice = new Slice({character: 'you'});
    expect(slice.isYou()).toBe(true);
  });

  it('should not be you', () => {
    const slice = new Slice({character: 'pirhoo'});
    expect(slice.isYou()).toBe(false);
  });

  it('should have a reading time to 0 when no character is given', () => {
    const slice = new Slice({text: 'Hello world'});
    expect(slice.readingTime).toBe(0);
  });

  it('should have a reading time to greater than 0 when a character is given', () => {
    const slice = new Slice({text: 'Hello world', character: 'you'});
    expect(slice.readingTime > 0).toBe(true);
  });

  it('should be an "event" when no character is given', () => {
    const slice = new Slice({text: 'Hello world'});
    expect(slice.type).toBe('event');
  });

  it('should be an "chat" when a character is given', () => {
    const slice = new Slice({character: 'you'});
    expect(slice.type).toBe('chat');
  });
});
