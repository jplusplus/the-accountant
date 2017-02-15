import angular from 'angular';
import 'angular-mocks';
import 'angular-hotkeys';
// Import the whole app
import '../../index';
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

  it('should have 3 vars', () => {
    expect(game.vars.length).toEqual(3);
  });

  it('should have 2 public vars', () => {
    expect(game.publicVars.length).toEqual(2);
  });

  it('should have 2 public rish', () => {
    expect(game.publicRisks.length).toEqual(2);
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
    // Party is not over!
    expect(game.isOver()).toBe(false);
  });

  it('should have a feedback after the first choice', () => {
    game.step.select();
    expect(game.hasFeedback()).toBe(true);
  });

  it('should have a no feedback after the first choice', () => {
    game.step.select(1);
    expect(game.hasFeedback()).toBe(false);
  });

  it('should change the number of repositories', () => {
    // Start with 10 in the var repositories
    expect(game.var('repositories').value).toEqual(10);
    // Select the default choice at the first step
    game.step.select().finalSlice();
    // Select the second choice
    game.step.select(1).finalSlice();
    // The var must not have changed
    expect(game.var('repositories').value).toEqual(11);
  });

  it('should has explainer', () => {
    // There is no explainer
    expect(game.lastExplainer).toBeUndefined();
    // Select the default choice and continue
    game.step.select().finalSlice();
    // There is explainer now
    expect(game.lastExplainer).toBeDefined();
  });

  it('should continue to the next slice', () => {
    // Start a -1 meaning no actual slice
    expect(game.slice).toEqual(-1);
    game.continue();
    expect(game.slice).toEqual(0);
    game.continue();
    expect(game.slice).toEqual(1);
    game.continue();
    expect(game.slice).toEqual(2);
  });

  it('should reach the final slice', () => {
    // Start a -1 meaning no actual slice
    expect(game.slice).toEqual(-1);
    game.finalSlice();
    expect(game.slice).toEqual(3);
    game.continue();
    expect(game.slice).toEqual(3);
  });

  it('should re-serialize history after each selection', () => {
    expect(game.historySerialized.length).toEqual(0);
    game.step.select().terminate();
    expect(game.historySerialized.length).toEqual(1);
    game.step.select().terminate();
    expect(game.historySerialized.length).toEqual(2);
  });

  it('should serialize history according to selection', () => {
    game.step.select(0).terminate();
    expect(game.historySerialized[0]).toEqual([0, 0]);
    game.step.select(1).terminate();
    expect(game.historySerialized[1]).toEqual([1, 1]);
    game.step.select(1).terminate();
    expect(game.historySerialized[2]).toEqual([2, 1]);
  });

  it('should load history', () => {
    // Each line is a pair of step index and choice index
    game.load([
      [0, 0],
      [1, 1],
      [2, 1]
    ]);
    // Should be at the fourth step
    expect(game.step.index).toEqual(3);
    expect(game.isOver()).toBe(false);
    // And variable should have changed accordingly
    expect(game.var('repositories').value).toEqual(11);
    expect(game.var('risk_unpopularity').value).toEqual(20);
  });
});
