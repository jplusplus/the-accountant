import angular from 'angular';
import 'angular-mocks';
import 'angular-hotkeys';
// Import the whole app
import '../index';
// Import a fixture game config
import fixture from './game.fixture.json';

describe('component: game', () => {
  let game;

  beforeEach(() => {
    angular.mock.module('app');
  });

  beforeEach(angular.mock.inject(Game => {
    game = new Game(fixture);
  }));

  it('should init game correctly', () => {
    // Same number of steps
    expect(game.steps.length).toEqual(fixture.steps.length);
    // Same number of endings
    expect(game.endings.length).toEqual(fixture.endings.length);
    // Start with 10 in the var repositories
    expect(game.var('repositories').value).toEqual(10);
  });

  it('should select the first choice without incidence', () => {
    // Start with 10 in the var repositories
    expect(game.var('repositories').value).toEqual(10);
    expect(game.stepIndex).toEqual(0);
    // Select the default choice at the first step
    game.step.select().finalSlice();
    expect(game.stepIndex).toEqual(1);
    // The var must not have changed
    expect(game.var('repositories').value).toEqual(10);
    // Select the default choice at the second step
    game.step.select().finalSlice();
    expect(game.stepIndex).toEqual(2);
    // The var must not have changed
    expect(game.var('repositories').value).toEqual(10);
  });

  it('should change the number of repositories', () => {
    // Start with 10 in the var repositories
    expect(game.var('repositories').value).toEqual(10);
    // Select the default choice at the first step
    game.step.select().finalSlice();
    // Select the second choice
    game.step.select(game.step.choices[1]).finalSlice();
    // The var must not have changed
    expect(game.var('repositories').value).toEqual(11);
  });
});
