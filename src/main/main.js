import _ from 'lodash';

export const main = {
  template: require('./main.html'),
  bindings: {
    game: '<'
  },
  /** @ngInject */
  controller($state, $scope, $timeout, hotkeys, $transitions) {
    this.$onInit = () => {
      // Method to start a new party
      this.playAgain = this.start = () => {
        // Simply create a new instance of game
        $state.go('main', {}, {reload: true});
      };
      this.prepareNewYear = () => {
        return $timeout(() => {
          // Udate last displayed year
          this.year = this.game.step.year;
          // Then wait for the next slice again
          this.waitNextSlice();
        // Skip timeout for the first year
        }, !this.game.isFirstYear() * 1000);
      };
      // Create a timeout to go to the next slice
      this.waitNextSlice = () => {
        // Cancel any existing timeout
        $timeout.cancel(this.nextSliceTimeout);
        // The year chanched
        if (this.year !== this.game.step.year) {
          // Wait for it...
          this.nextSliceTimeout = this.prepareNewYear();
        // Party might be over
        } else if (this.game.allowsNextSlice() && $state.is('main')) {
          // Define duration according to the readingTime
          const duration = this.game.targetSlice.isStartingSlice() ? 3000 : this.game.readingTime;
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
        if (this.game.step.isLastSlice() && this.game.step.choices.length === 1 && !this.game.step.selection) {
          // Select the default value
          this.game.step.select();
        } else {
          // Update last displayed year
          this.year = this.game.step.year;
          // Go to the final slice
          this.game.finalSlice();
        }
        // Cancel any existing timeout and restart it
        this.waitNextSlice();
      };
      this.visibleYears = () => {
        const years = _.range(this.game.step.year - 1, this.game.step.year + 1);
        // Remove years out of bounds and return the array
        return years.filter(y => {
          return y >= _.first(this.game.years) && y <= this.year;
        });
      };
      this.start = () => {
        this.started = true;
        // Create a gave
        this.prepareNewYear();
        // Watch keyboard
        hotkeys.add({combo: 'space', callback: this.continue});
      };
      // Go automaticaly to the next slice
      $scope.$on('game:slice:next', this.waitNextSlice);
      $scope.$on('game:selection', this.waitNextSlice);
      // Restart the timer when re-entering this state
      $transitions.onSuccess({to: 'main'}, this.waitNextSlice);
    };
  }
};
