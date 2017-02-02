import angular from 'angular';
import 'angular-mocks';
import 'angular-hotkeys';
// Import the whole app
import '../index';
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
    // It must have a hint
    expect(step.hasHint()).toBe(true);
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

  it('should be set on the correct year', () => {
    expect(game.steps[0].year).toBe(2011);
    expect(game.steps[1].year).toBe(2011);
    expect(game.steps[2].year).toBe(2012);
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
    // There is no feedback for the first step's choice
    expect(game.step.select().isTyping()).toBe(false);
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
    game.step.select(game.step.choices[1]).terminate();
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
    game.step.select(game.step.choices[1]).terminate();
    // The condition is now fulfiled
    expect(game.steps[3].assert).toBe(true);
  });

  it('should not display hint until the user has to select something', () => {
    // Jump to the choice
    game.step.finalSlice();
    // No hint yet
    expect(game.step.displayHint()).toBe(false);
    // Jump to the second step
    game.step.select().terminate();
    // No hint yet
    expect(game.step.displayHint()).toBe(false);
    // Jump to the choice
    game.step.finalSlice();
    // There should have a hint!
    expect(game.step.displayHint()).toBe(true);
  });
});
