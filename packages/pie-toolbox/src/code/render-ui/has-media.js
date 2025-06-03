const dp = new DOMParser();

/*
 * Check if the string contains at least one media element.
 */
export const hasMedia = (s) => {
  if (!s) {
    return false;
  }
  const root = dp.parseFromString(s, 'text/html');
  return !!root.body.querySelector('img') || !!root.body.querySelector('video') || !!root.body.querySelector('audio');
};
