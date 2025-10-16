import createCache from '@emotion/cache';

export function createEmotionCache() {
  let insertionPoint;

  if (typeof document !== 'undefined') {
    // Only runs in the browser
    const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'mui-style', insertionPoint });
}
