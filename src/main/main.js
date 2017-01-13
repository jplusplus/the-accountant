export const main = {
  template: require('./main.html'),
  /** @ngInject */
  controller(Game, $scope) {
    this.game = new Game();
    // When the plaer select something, we may display the feedback
    $scope.$on('game:selection', () => {
      this.showFeedback = this.game.hasFeedback();
    });
    // Method to start a new party
    this.playAgain = () => {
      // Simply create a new instance of game
      this.game = new Game();
    };
  }
};
