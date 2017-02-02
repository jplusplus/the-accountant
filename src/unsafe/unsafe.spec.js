import angular from 'angular';
import 'angular-mocks';
import unsafeFilter from './unsafe.filter';

describe('filter: unsafe', () => {
  beforeEach(() => {
    angular.module('unsafe', []).filter('unsafe', unsafeFilter);
    angular.mock.module('unsafe');
  });

  it('should not escape any html from the given', angular.mock.inject(($sce, unsafeFilter) => {
    const html = '<strong>Yolo</strong>';
    const trusted = unsafeFilter(html);
    expect($sce.getTrustedHtml(trusted)).toBe(html);
  }));
});
