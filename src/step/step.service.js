export default StepService;

/* ngInject */
function StepService(Choice, $log) {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');
  const _choices = Symbol('choices');

  class Step {
    constructor(meta, game) {
      this[_game] = game;
      this[_meta] = angular.copy(meta);
      // Create choices
      this[_choices] = this[_meta].choices.map(meta => new Choice(meta, this));
    }
    isCurrent() {
      return this.game.stepIndex === this.index;
    }
    select(choice) {
      this.game.history.push(choice);
      // Add info to the log
      $log.info('Step %s: choice %s', this.index, choice.index);
    }
    get choices() {
      return this[_choices];
    }
    get index() {
      return this.game.steps.indexOf(this);
    }
    get text() {
      return this[_meta]['text@en'];
    }
    get game() {
      return this[_game];
    }
  }
  return Step;
}
