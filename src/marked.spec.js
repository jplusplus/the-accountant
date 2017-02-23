import _ from 'lodash';
import angular from 'angular';
import 'angular-mocks';
import 'angular-marked';
import 'marked';

import markedConfig from './marked';

describe('config: marked', () => {
  beforeEach(() => {
    angular.module('marked', ['hc.marked']).config(markedConfig);
    angular.mock.module('marked');
  });

  it('should add a target blank to every links', angular.mock.inject(marked => {
    const html = '[pirhoo](http://pirhoo.com)';
    marked = _.flow(marked, _.trim);
    expect(marked(html)).toBe('<p><a href="http://pirhoo.com" title="" target="_blank">pirhoo</a></p>');
  }));

  it('should add a target blank to every links even with a title', angular.mock.inject(marked => {
    const html = '[pirhoo](http://pirhoo.com "Pirhoo")';
    marked = _.flow(marked, _.trim);
    expect(marked(html)).toBe('<p><a href="http://pirhoo.com" title="Pirhoo" target="_blank">pirhoo</a></p>');
  }));
});
