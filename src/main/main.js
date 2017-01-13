export const main = {
  template: require('./main.html'),
  /** @ngInject */
  controller(Game, $scope) {
    this.game = new Game();
    // When the player select something, we may display the feedback
    $scope.$on('game:selection', () => {
      this.showFeedback = this.game.hasFeedback();
      // Save last action
      this.lastAction = 'selection';
    });
    // When the player undo an action, we have to know!
    $scope.$on('game:undo', () => {
      // Save last action
      this.lastAction = 'undo';
    });
    // Method to start a new party
    this.playAgain = () => {
      // Simply create a new instance of game
      this.game = new Game();
    };
  }
};
