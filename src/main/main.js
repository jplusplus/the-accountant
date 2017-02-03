import _ from 'lodash';

export const main = {
  template: require('./main.html'),
  bindings: {
    game: '<',
    history: '<'
  },
  /** @ngInject */
  controller($state, $scope, $timeout, hotkeys, $transitions, $localForage) {
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
      $timeout.cancel(this.continueTimeout);
      // The year changed
      if (this.year !== this.game.step.year) {
        // Wait for it...
        this.continueTimeout = this.prepareNewYear();
      // Party might be over
      } else if (this.game.allowsNextSlice() && $state.is('main')) {
        // Define duration according to the readingTime of the next slice
        this.continueTimeout = $timeout(this.game.continue, this.game.delay);
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
      const years = _.range(this.game.step.year - 2, this.game.step.year + 1);
      // Remove years out of bounds and return the array
      return years.filter(y => {
        return y >= _.first(this.game.years) && y <= this.year;
      });
    };
    // The party start!
    this.start = () => {
      this.started = true;
      // Create a gave
      this.continueTimeout = this.prepareNewYear();
      // Watch keyboard
      hotkeys.add({combo: 'space', callback: this.continue});
    };
    // Continue to the last position
    this.load = () => {
      this.game.load(this.history);
      // And start the party
      this.start();
    };
    // Save user history
    this.save = () => {
      $localForage.setItem('history', this.game.historySerialized);
    };
    // Go automaticaly to the next slice
    $scope.$on('game:slice:next', this.waitNextSlice);
    $scope.$on('game:selection', this.waitNextSlice);
    $scope.$on('game:over', this.waitNextSlice);
    // After each selection, we save the history
    $scope.$on('game:selection', this.save);
    $scope.$on('game:undo', this.save);
    // Losing will clear history
    $scope.$on('game:over', () => $localForage.removeItem('history'));
    // Restart the timer when re-entering this state
    $transitions.onSuccess({to: 'main'}, this.waitNextSlice);
  }
};
