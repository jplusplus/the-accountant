export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('main', {
      url: '/',
      component: 'main',
      resolve: {
        /** @ngInject */
        game: Game => new Game(),
        /** @ngInject */
        history: $localForage => $localForage.getItem('history')
      }
    })
    .state('main.vars', {
      url: 'vars',
      component: 'mainVars'
    })
    .state('main.hints', {
      url: 'hints',
      component: 'mainHints'
    });
}
