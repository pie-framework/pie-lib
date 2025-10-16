import React from 'react';
import App from 'next/app';
import { CacheProvider } from '@emotion/react';
import { createEmotionCache } from '../source/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

export default class MyApp extends App {
  render() {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = this.props;
    return (
      <CacheProvider value={emotionCache}>
        <Component {...pageProps} />
      </CacheProvider>
    );
  }
}
