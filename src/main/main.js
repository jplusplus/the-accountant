export const main = {
  template: require('./main.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller($state, $scope, $timeout) {
    this.$onInit = () => {
      // Method to start a new party
      this.playAgain = this.start = () => {
        // Simply create a new instance of game
        $state.go('main', {}, {reload: true});
      };
      // Create a timeout to go to the next slice
      this.waitNextSlice = () => {
        // Cancel any existing timeout
        $timeout.cancel(this.nextSliceTimeout);
        // Party might be over
        if (this.game.step !== null) {
          // Define duration according to the readingTime
          const duration = this.game.step.readingTime;
          // Set another one
          this.nextSliceTimeout = $timeout(this.game.step.nextSlice, duration);
        }
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
      this.waitNextSlice();
    };
  }
};
