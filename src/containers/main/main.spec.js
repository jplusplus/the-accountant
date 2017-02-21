import angular from 'angular';
import 'angular-mocks';
import 'angular-hotkeys';
// Import the whole app
import '../../index';

describe('component: main', () => {
  let $rootScope;
  let $compile;
  let $timeout;
  let $componentController;
  let Game;

  beforeEach(() => {
    angular.module('app').config($translateProvider => {
      $translateProvider.translations('en', {});
      $translateProvider.translations('fr', {});
      $translateProvider.preferredLanguage('en');
    });
    angular.mock.module('app');
  });

  beforeEach(angular.mock.inject((_$rootScope_, _$compile_, _$componentController_, _$timeout_, _Game_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    Game = _Game_;
  }));

  it('should render correctly', () => {
    const $scope = $rootScope.$new();
    // Add a game instance must be binded to main component
    $scope.game = new Game();
    const element = $compile('<main game="game"></main>')($scope);
    // Apply a digest
    $scope.$digest();
    const h1 = element.find('h1').eq(0);
    expect(h1.text().trim()).toEqual('main.toolbar.heading');
  });

  it('should init a timeout after start', () => {
    // Instanciate the main component
    const ctrl = $componentController('main', {}, {game: new Game()});
    // This timeout must not be defined (yet)
    expect(ctrl.continueTimeout).not.toBeDefined();
    // Wrap the start function with a spy and call it
    spyOn(ctrl, 'start').and.callThrough();
    // Start the party
    ctrl.start();
    // Did we call it correctly?
    expect(ctrl.start).toHaveBeenCalled();
    // Did we set the `started` attribute to true?
    expect(ctrl.started).toEqual(true);
    // Did we set a timeout, at last?
    expect(ctrl.continueTimeout).toBeDefined();
  });

  it('should call prepareNewYear method after start', () => {
    // Instanciate the main component
    const ctrl = $componentController('main', {}, {game: new Game()});
    spyOn(ctrl, 'prepareNewYear').and.callThrough();
    // Start the party
    ctrl.start();
    expect(ctrl.prepareNewYear).toHaveBeenCalled();
    // Simulate passing time
    $timeout.flush();
    // Apply a digest
    $rootScope.$digest();
    // Check that the year have been prepared correctly
    expect(ctrl.year).toEqual(ctrl.game.years[0]);
  });

  it('should go to the final slice of the current stack', () => {
    // Instanciate the main component
    const ctrl = $componentController('main', {}, {game: new Game()});
    // Start the party
    ctrl.start();
    // Shouldn't be the final slice yet
    expect(ctrl.game.lastStack.isLastSlice()).toEqual(false);
    // Go to the final slice
    ctrl.continue();
    // Aserts it's true
    expect(ctrl.game.lastStack.isLastSlice()).toEqual(true);
  });
});
