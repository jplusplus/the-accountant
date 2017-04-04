/** @ngInject */
module.exports.translateConfig = function translateConfig($translateProvider, tmhDynamicLocaleProvider) {
  // Load current locale
  tmhDynamicLocaleProvider.localeLocationPattern('//code.angularjs.org/1.2.20/i18n/angular-locale_{{locale}}.js');
  // Configure Angular Translate
  $translateProvider
    .useStaticFilesLoader({
      prefix: 'locales/',
      suffix: '.json'
    })
    .registerAvailableLanguageKeys(['es'], {
      'es_ES': 'es',
      'en_US': 'es',
      'en_UK': 'es',
      'en-US': 'es',
      'en-UK': 'es',
      'fr_FR': 'es',
      'fr_BE': 'es',
      'de_DE': 'es',
      'sk_SK': 'es'
    })
    .determinePreferredLanguage()
    .fallbackLanguage('es')
    .useLocalStorage()
    .useSanitizeValueStrategy(null);
};

/** @ngInject */
module.exports.translateRun = function translateRun($transitions, $location, $translate, tmhDynamicLocale) {
  // Redirect to login if route requires auth and you're not logged in
  $transitions.onSuccess({}, () => {
    // Get the lang from the file name
    const fileLang = ($location.absUrl().match(/\/(\w{2})\.html/) || [])[1];
    // Or get lang from location search
    const lang = fileLang || $location.search().lang;
    // Does the search param exists?
    if ($translate.getAvailableLanguageKeys().indexOf(lang) > -1) {
      // Update current language
      $translate.use(lang);
      tmhDynamicLocale.set(lang.slice(0, 2));
    } else {
      tmhDynamicLocale.set($translate.use().slice(0, 2));
    }
  });
};
