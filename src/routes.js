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
      component: 'mainVars'
    })
    .state('main.hints', {
      component: 'mainHints',
      url: 'hints/:ref',
      params: {
        ref: null
      }
    })
    .state('main.page', {
      component: 'mainPage',
      url: 'page/:slug',
      params: {
        language: {
          value: null
        }
      },
      resolve: {
        /** @ngInject */
        markdown: ($stateParams, $http, $translate) => {
          // Find the current language
          const language = $stateParams.language || $translate.proposedLanguage() || $translate.use() || 'en';
          // Build the markdown path
          const path = `markdowns/${$stateParams.slug}/${language}.md`;
          // Return a promise
          return $http.get(path).then(res => res.data);
        }
      }
    });
}
