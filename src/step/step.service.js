export default StepService;

/* ngInject */
function StepService() {
  // Symbols declarion for private attributes and methods
  const _meta = Symbol('meta');
  const _game = Symbol('game');

  class Step {
    constructor(meta, game) {
      this[_meta] = angular.copy(meta);
      this[_game] = game;
    }
  }
  return Step;
}
