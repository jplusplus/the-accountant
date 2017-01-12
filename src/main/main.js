export const main = {
  template: require('./main.html'),
  /** @ngInject */
  controller(Game) {
    this.game = new Game();
  }
};
