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

  it('should has hint', () => {
    // There is no hint
    expect(game.lastHint).toBeUndefined();
    // Select the default choice and continue
    game.step.select().finalSlice();
    // There is hint now
    expect(game.lastHint).toBeDefined();
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
    game.step.select().terminate();
    expect(game.historySerialized[0]).toEqual([0, 0]);
    game.step.select(1).terminate();
    expect(game.historySerialized[1]).toEqual([1, 1]);
  });
});
