export default markedConfig;

/** @ngInject */
function markedConfig(markedProvider) {
  markedProvider.setRenderer({
    link: (href, title, text) => {
      return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
    }
  });
}
