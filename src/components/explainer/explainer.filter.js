export default explainerFilter;

/** @ngInject */
function explainerFilter(Explainer, $state) {
  return (text, state = 'main') => {
    // Find every explainer
    Explainer.parse(text).forEach(expl => {
      // Create a sref
      const href = $state.href(state, expl);
      // Build the link that should replace the needle
      const link = `<a href="${href}">${expl.text}</a>`;
      // Replace the needle by the link
      text = text.split(expl.needle).join(link);
    });
    // Return the text after modification
    return text;
  };
}
