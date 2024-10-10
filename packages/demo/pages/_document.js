import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { JssProvider } from 'react-jss';
import getPageContext from '../source/getPageContext';
import flush from 'styled-jsx/server';

export default class MyDocument extends Document {
  static getInitialProps(ctx) {
    const pageContext = getPageContext();

    /* eslint-disable */
    const page = ctx.renderPage((Component) => (props) => (
      <JssProvider registry={pageContext.sheetsRegistry} generateClassName={pageContext.generateClassName}>
        <Component pageContext={pageContext} {...props} />
      </JssProvider>
    ));
    /* eslint-enable */

    return {
      ...page,
      pageContext,
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: pageContext.sheetsRegistry.toString(),
            }}
          />
          {flush() || null}
        </React.Fragment>
      ),
    };
  }

  render() {
    const { pageContext, path } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          <title>{path}</title>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={'user-scalable=0, initial-scale=1, ' + 'minimum-scale=1, width=device-width, height=device-height'}
          />
          {/* PWA primary color */}
          <meta name="theme-color" content={pageContext.theme.palette.primary.main} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

          {/* MathJax Script for rendering mathematical expressions */}
          {/*<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>*/}
          {/*<script type="text/javascript" src="https://app-asset-cdn.schoolcity.com/live/mathjax/MathJax-2.7.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>*/}

          {/*<script*/}
          {/*  type="text/x-mathjax-config"*/}
          {/*  dangerouslySetInnerHTML={{*/}
          {/*    // __html: `*/}
          {/*    //   MathJax.Hub.Config({*/}
          {/*    //     tex2jax: {*/}
          {/*    //       inlineMath: [['$','$'], ['\\\\(','\\\\)']],*/}
          {/*    //       processEscapes: true*/}
          {/*    //     }*/}
          {/*    //   });*/}
          {/*    // `,*/}
          {/*    __html: `*/}
          {/*    window.preventPIEtoOverwriteMathJax = true;*/}
          {/*      MathJax.Hub.Config({*/}
          {/*        tex2jax: {*/}
          {/*          inlineMath: [['\\\\(','\\\\)']]*/}
          {/*        },*/}
          {/*        MathML: {*/}
          {/*          extensions: [*/}
          {/*            "mml3.js",*/}
          {/*            "https://app-asset-cdn.schoolcity.com/live/mathjax/MathJax-2.7.2/extensions/TeX/mhchem.js"*/}
          {/*          ]*/}
          {/*        },*/}
          {/*        TeX: {*/}
          {/*          Macros: {*/}
          {/*            rightangle: "\\\\unicode{x0221F}",*/}
          {/*            rightanglewitharc: "\\\\unicode{x22be}",*/}
          {/*            rightanglewithcorner: "\\\\unicode{x0299C}",*/}
          {/*            righttriangle: "\\\\unicode{x022BF}"*/}
          {/*          }*/}
          {/*        },*/}
          {/*        showMathMenu: false,*/}
          {/*        messageStyle: "none"*/}
          {/*      });*/}
          {/*      MathJax.Hub.processSectionDelay = 0;*/}
          {/*      MathJax.Hub.processUpdateDelay = 0;*/}
          {/*    `,*/}
          {/*  }}*/}
          {/*></script>*/}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
