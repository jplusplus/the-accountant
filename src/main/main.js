export const main = {
  template: require('./main.html'),
  /* ngInject */
  controller(Game, $log) {
    this.game = new Game();
    $log.info(this.game.years);
  }
};
