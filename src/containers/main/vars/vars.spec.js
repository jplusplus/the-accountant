import angular from 'angular';
import 'angular-mocks';
// Import the whole app
import '../../../index';

describe('component: main.vars', () => {
  let game;
  let ctrl;
  // Demo history
  const HISTORY = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [5, 0], [6, 0], [7, 2], [8, 0]];

  beforeEach(() => {
    angular.mock.module('app');
  });

  beforeEach(angular.mock.inject(($componentController, Game) => {
    // Create a game
    game = new Game();
    // Load a party
    game.load(HISTORY);
    // Instanciate the main component
    ctrl = $componentController('mainVars', {}, {game});
  }));

  it('should create 2 charts', () => {
    expect(ctrl.chartsIds().length).toEqual(2);
  });
});
