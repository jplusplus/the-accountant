export const main = {
  template: require('./main.html'),
  /** @ngInject */
  controller(Game, $scope) {
    this.game = new Game();
    // When the plaer select something, we may display the feedback
    $scope.$on('game:selection', () => {
      this.showFeedback = this.game.hasFeedback();
    });
  }
};
