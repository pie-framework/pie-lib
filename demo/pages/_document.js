import Document, { Head, Main, NextScript } from 'next/document';
// import { ServerStyleSheet } from 'styled-components';
import React from 'react';
import { JssProvider, SheetsRegistry } from 'react-jss';
// import { renderToString } from 'react-dom/server';
// import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName
} from 'material-ui/styles';
import getPageContext from '../src/getPageContext';
import flush from 'styled-jsx/server';

import { green, red } from 'material-ui/colors';
import CssBaseline from 'material-ui/CssBaseline';

export default class MyDocument extends Document {
  static getInitialProps(ctx) {
    // Resolution order
    //
    // On the server:
    // 1. page.getInitialProps
    // 2. document.getInitialProps
    // 3. page.render
    // 4. document.render
    //
    // On the server with error:
    // 2. document.getInitialProps
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. page.getInitialProps
    // 3. page.render

    // Get the context of the page to collected side effects.
    const pageContext = getPageContext();
    const page = ctx.renderPage(Component => props => (
      <JssProvider
        registry={pageContext.sheetsRegistry}
        generateClassName={pageContext.generateClassName}
      >
        <Component pageContext={pageContext} {...props} />
      </JssProvider>
    ));

    return {
      ...page,
      pageContext,
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: pageContext.sheetsRegistry.toString()
            }}
          />
          {flush() || null}
        </React.Fragment>
      )
    };
  }
  // static getInitialProps({ renderPage }) {
  //   // Create a theme instance.
  //   const theme = createMuiTheme({});

  //   const sheets = new SheetsRegistry();
  //   const generateClassName = createGenerateClassName();

  //   // Render the component to a string.
  //   const page = renderPage(App => props => {
  //     console.log('app: ', App);
  //     return (
  //       <JssProvider registry={sheets} generateClassName={generateClassName}>
  //         <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
  //           <App {...props} />
  //         </MuiThemeProvider>
  //       </JssProvider>
  //     );
  //   });

  //   // Grab the CSS from our sheetsRegistry.
  //   // const css = sheetsRegistry.toString();

  //   // const page = renderPage(App => props => (
  //   //   <JssProvider registry={sheets}>
  //   //     <App {...props} />
  //   //   </JssProvider>
  //   // ));
  //   // sheet.collectStyles(<App {...props} />)
  //   // );
  //   const styles = sheets.toString();
  //   console.log('styles: ', styles);
  //   // const styleTags = sheet.getStyleElement();
  //   return { ...page, styleTags: styles };
  // }

  componentDidMount() {
    // const el = document.getElementById('server-side-styles');
    // el.parentNode.removeChild();
  }

  render() {
    const { pageContext } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          <title>My page</title>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              'user-scalable=0, initial-scale=1, ' +
              'minimum-scale=1, width=device-width, height=device-height'
            }
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
