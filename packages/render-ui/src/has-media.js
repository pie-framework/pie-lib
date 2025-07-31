let parser;

if (typeof window !== 'undefined') {
  parser = new DOMParser();
}

/*
 * Check if the string contains at least one media element.
 */
export const hasMedia = (s) => {
  if (!s) {
    return false;
  }
  const root = parser.parseFromString(s, 'text/html');
  return !!root.body.querySelector('img') || !!root.body.querySelector('video') || !!root.body.querySelector('audio');
};
