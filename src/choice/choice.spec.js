import angular from 'angular';
import 'angular-mocks';
import 'angular-hotkeys';
// Import the whole app
import '../index';
// Import a fixture game config
import fixture from '../game/game.fixture.json';

describe('component: choice', () => {
  let game;

  beforeEach(() => {
    angular.mock.module('app');
  });

  beforeEach(angular.mock.inject(Game => {
    game = new Game(fixture);
  }));

  it('should be fired since nobody likes me', () => {
    // Say 'go' at step 0
    game.step.select().terminate();
    // Say 'do not open!' at step 1
    game.step.select().terminate();
    // Not yet...
    expect(game.isOver()).toBe(false);
    // Say 'delete the account!' at step 2
    game.step.select(game.step.choices[1]).terminate();
    // The risk is too high, there is no chance we are not fired
    expect(game.isOver()).toBe(true);
  });

  it('should not be fired because you are a nice fellow', () => {
    // Say 'go' at step 0
    game.step.select().terminate();
    // Say 'open!' at step 1
    game.step.select(game.step.choices[1]).terminate();
    // Not yet...
    expect(game.isOver()).toBe(false);
    // Say 'keep the account!' at step 2
    game.step.select().terminate();
    // The condition to be fired is hopefully not fulfilled
    expect(game.isOver()).toBe(false);
  });
});
