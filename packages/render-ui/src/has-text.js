let parser;

if (typeof window !== 'undefined') {
  parser = new DOMParser();
}

const markupToText = (s) => {
  const root = parser.parseFromString(s, 'text/html');
  return root.body.textContent;
};

export const hasText = (s) => {
  if (!s) {
    return false;
  }
  const tc = markupToText(s);
  return !!(tc && tc.trim());
};
