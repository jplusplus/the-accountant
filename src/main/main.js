export const main = {
  template: require('./main.html'),
  /** @ngInject */
  controller(Game, $scope, $timeout) {
    // Method to start a new party
    this.playAgain = this.start = () => {
      // Simply create a new instance of game
      this.game = new Game();
      this.waitNextSlice();
    };
    // Create a timeout to go to the next slice
    this.waitNextSlice = () => {
      // Cancel any existing timeout
      $timeout.cancel(this.nextSliceTimeout);
      // Set another one
      this.nextSliceTimeout = $timeout(this.game.step.nextSlice, this.game.step.readingTime);
    };
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
    // Go automaticaly to the next slice
    $scope.$on('game:step:slice:next', this.waitNextSlice);
    // Create a gave
    this.start();
  }
};
