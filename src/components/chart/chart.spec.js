import angular from 'angular';
import 'angular-mocks';
// Import the whole app
import '../../index';

describe('component: chart', () => {
  let game;
  let ctrl;
  // Demo history
  const HISTORY = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [5, 0], [6, 0], [7, 2], [8, 0]];

  beforeEach(() => {
    angular.mock.module('app');
  });

  beforeEach(angular.mock.inject(($componentController, Game) => {
    // Create a game
    game = new Game();
    // Load a party
    game.load(HISTORY);
    // Instanciate the main component
    ctrl = $componentController('chart', {}, {id: 'personal_account', game});
    // Init the component just like ui-router does
    ctrl.$onInit();
  }));

  it('should calculate the cumulated value of `personal_account` though years', () => {
    // Get `personal_account`chart description
    const valueByYear = ctrl.chart.valueByYear.personal_account;
    // First year should be equal to the initial value
    expect(valueByYear[1993]).toEqual(game.meta.vars.personal_account.value);
  });

  it('should cumulate values correctly', () => {
    // Get `personal_account` chart description
    const valueByYear = ctrl.chart.valueByYear.personal_account;
    expect(valueByYear[1993]).toEqual(1000);
    expect(valueByYear[1994]).toEqual(16000);
    expect(valueByYear[1995]).toEqual(21000);
  });

  it('should create a value for each year', () => {
    // First year should be equal to the initial value
    expect(ctrl.chart.data.personal_account.length).toEqual(8);
  });

  it('should create a year equal to the current value', () => {
    // Get `personal_account` chart description
    const valueByYear = ctrl.chart.valueByYear.personal_account;
    expect(valueByYear[2000]).toEqual(game.var('personal_account').value);
  });
});
