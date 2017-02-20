import angular from 'angular';
import 'angular-mocks';
// Import the whole app
import '../../../index';

describe('component: main.page', () => {
  beforeEach(() => {
    angular.mock.module('app');
  });

  it('should render markdown to HTML', angular.mock.inject(($compile, $rootScope) => {
    const markdown = '# Lorem ipsum\nDolor sit amet!';
    const $scope = $rootScope.$new();
    const element = $compile(`<main-page markdown="'${markdown}'"></main-page>`)($scope);
    // Apply a digest
    $scope.$digest();
    // Find the title
    const h1 = element.find('h1');
    expect(h1.text().trim()).toEqual('Lorem ipsum');
    // Find the p
    const p = element.find('p');
    expect(p.text().trim()).toEqual('Dolor sit amet!');
  }));
});
