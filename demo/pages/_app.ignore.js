import App, { Container } from 'next/app';
import React from 'react';
import Root from '../src/root';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log('page props');
    return (
      <Container>
        <Root list={['foo', 'bar']} current={'foo'}>
          <Component {...pageProps} />
        </Root>
      </Container>
    );
  }
}
