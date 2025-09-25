const REGEX = /\{\{(\d+)\}\}/g;

export default (s, t) => {
  if (!s) {
    return { markup: '' };
  }

  const markup = s.replace(REGEX, (match, g) => {
    return `<span data-component="${t}" data-id="${g}"></span>`;
  });

  return { markup };
};
