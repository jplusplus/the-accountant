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
        if (this.game.step !== null && $state.is('main')) {
          // Define duration according to the readingTime
          const duration = this.game.step.readingTime;
          // Set another one
          this.nextSliceTimeout = $timeout(this.game.step.nextSlice, duration);
        }
      };
      // Go automaticaly to the next slice
      $scope.$on('game:step:slice:next', this.waitNextSlice);
      // Create a gave
      this.waitNextSlice();
    };
  }
};
