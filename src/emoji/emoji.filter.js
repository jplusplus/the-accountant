import twemoji from 'twemoji';
export default emojiFilter;

/** @ngInject */
function emojiFilter() {
  return twemoji.parse;
}
