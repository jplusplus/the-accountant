export const main = {
  template: require('./main.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller($state, $scope, $timeout, $log, hotkeys) {
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
          const duration = Math.max(this.game.readingTime, 700);
          // Set another one
          this.nextSliceTimeout = $timeout(this.game.nextSlice, duration);
        }
      };
      // Continue to the next slice OR the next step if possible
      this.continue = () => {
        // Party is over
        if (this.game.step === null) {
          return;
        }
        // This is the last slice and therre is only one choose
        if (this.game.step.isLastSlice() && this.game.step.choices.length === 1) {
          // Select the default value
          this.game.step.select();
        } else {
          // Go to the next slice
          this.game.finalSlice();
        }
        // Cancel any existing timeout and restart it
        this.waitNextSlice();
      };
      // Go automaticaly to the next slice
      $scope.$on('game:slice:next', this.waitNextSlice);
      // Create a gave
      this.waitNextSlice();
      // Watch keyboard
      hotkeys.add({combo: 'space', callback: this.continue});
    };
  }
};
