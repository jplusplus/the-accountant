import angular from 'angular';
import 'angular-mocks';
import 'angular-hotkeys';
// Import the whole app
import '../../index';
// Import a fixture game config
import fixture from '../game/game.fixture.json';

describe('component: step', () => {
  let game;

  beforeEach(() => {
    angular.mock.module('app');
  });

  beforeEach(angular.mock.inject(Game => {
    game = new Game(fixture);
  }));

  it('should init step correctly', () => {
    // Get the second step of the fixture
    const step = game.steps[1];
    // It must have to choices
    expect(step.choices.length).toEqual(2);
    // It must have a explainer
    expect(step.hasExplainer()).toBe(true);
    // It must not have a condition
    expect(step.hasCondition()).toBe(false);
  });

  it('should have a correct intial state', () => {
    // Get the first step of the fixture
    const step = game.steps[0];
    // It should be the current step
    expect(step.isCurrent()).toBe(true);
    // It should be on the starting slice
    expect(step.isStartingSlice()).toBe(true);
    // It should have no previous slice
    expect(step.previous).toBe(null);
    // But it should have a next slice
    expect(step.next).not.toBe(null);
  });

  it('should move correctly between slices', () => {
    // It should be on the starting slice
    expect(game.step.isStartingSlice()).toBe(true);
    // Go to the first slice
    game.step.continue();
    // It should be on the first slice
    expect(game.step.isFirstSlice()).toBe(true);
    // Go to the second slice
    game.step.continue();
    // It should be on the first or the last slice
    expect(game.step.isFirstSlice()).toBe(false);
    expect(game.step.isLastSlice()).toBe(false);
    // Jump to the end
    game.step.finalSlice();
    // It should be the last
    expect(game.step.isLastSlice()).toBe(true);
  });

  it('should create 3 clusters', () => {
    expect(game.step.clusters.length).toBe(3);
  });

  it('should keep only the first cluster', () => {
    // Go to the first slice
    game.step.continue();
    // It should be on the first slice
    expect(game.step.isFirstSlice()).toBe(true);
    expect(game.step.clusterFilter(game.step.clusters[0], 0)).toBe(true);
    // Test every cluster
    game.step.clusters.slice(1).forEach((cluster, index) => {
      expect(game.step.clusterFilter(cluster, index + 1)).toBe(false);
    });
  });

  it('should create a cluster for each character in the right order', () => {
    // Go to the first slice
    game.step.continue();
    // First cluster is made by the COO
    expect(game.step.clusters[0].character.key).toBe('coo');
    // Second cluster is for an event (without character)
    expect(game.step.clusters[1].character).toBeUndefined();
    // Last cluster is made by the COO
    expect(game.step.clusters[2].character.key).toBe('coo');
  });

  it('should be set on the correct year', () => {
    expect(game.steps[0].year).toBe(2011);
    expect(game.steps[1].year).toBe(2011);
    expect(game.steps[2].year).toBe(2012);
  });

  it('should have a correct game', () => {
    expect(game.step.game).toEqual(game);
  });

  it('should have a current game as parent', () => {
    expect(game.step.parent).toEqual(game);
  });

  it('should find the correct game', () => {
    expect(game.step.findGame()).toEqual(game);
  });

  it('should be done only after selection', () => {
    // No selection yet
    expect(game.step.isDone()).toBe(false);
    // Jump to the selection
    game.step.finalSlice();
    // No selection yet
    expect(game.step.isDone()).toBe(false);
    // Pick something and terminate
    game.step.select().terminate();
    // It should be done
    expect(game.steps[0].isDone()).toBe(true);
    // It should also be the previous
    expect(game.steps[0].isPrevious()).toBe(true);
    // But not the current step
    expect(game.step.isDone()).toBe(false);
  });

  it('should be typing after a user selection', () => {
    expect(game.step.select().isTyping()).toBe(true);
    // Go to the next step
    game.step.terminate();
    // Someone is typing because we start a new step
    expect(game.step.isTyping()).toBe(true);
    // Select a value with a feedback from someone else
    expect(game.step.select().isTyping()).toBe(true);
  });

  it('should not be valid', () => {
    // The condition is not yet fulfiled
    expect(game.steps[3].assert).toBe(false);
  });

  it('should be valid', () => {
    // Say 'go' at step 0
    game.step.select().terminate();
    // Say 'open!' at step 1
    game.step.select(1).terminate();
    // The condition is now fulfiled
    expect(game.steps[3].assert).toBe(true);
  });

  it('should not be valid first, undo, then it should', () => {
    // Say 'go' at step 0
    game.step.select().terminate();
    // Say 'do not open!' at step 1
    game.step.select().terminate();
    // The condition isn't fulfiled
    expect(game.steps[3].assert).toBe(false);
    // Undo the selection
    game.undo();
    // Say 'open!' at step 1
    game.step.select(1).terminate();
    // The condition is now fulfiled
    expect(game.steps[3].assert).toBe(true);
  });

  it('should not display helper until the user has to select something', () => {
    // Jump to the choice
    game.step.finalSlice();
    // No hint yet
    expect(game.step.displayHelper()).toBe(false);
    // No hint in total
    expect(game.explainers.length).toBe(0);
    // Jump to the second step
    game.step.select().terminate();
    // No hint yet
    expect(game.step.displayHelper()).toBe(false);
    // Still no hint in total
    expect(game.explainers.length).toBe(0);
    // Jump to the choice
    game.step.finalSlice();
    // There should have a hint!
    expect(game.step.displayHelper()).toBe(true);
    // 1 past hint in total
    expect(game.explainers.length).toBe(1);
    expect(game.hasExplainers()).toBe(true);
  });
});
