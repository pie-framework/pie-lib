const REGEX = /\{\{(\d?)\}\}/g;
export default (s, t) => {
  const ids = [];
  if (!s) {
    throw new Error('No markup');
  }

  const markup = s.replace(REGEX, (match, g) => {
    return `<span data-component="${t}" data-id="${g}"></span>`;
  });

  return { ids, markup };
};
