import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import createEmotionServer from '@emotion/server/create-instance';
import { createEmotionCache } from '../source/createEmotionCache';
import getPageContext from '../source/getPageContext';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const cache = createEmotionCache(); // New cache per request
    const { extractCriticalToChunks } = createEmotionServer(cache);

    const originalRenderPage = ctx.renderPage;
    const pageContext = getPageContext();
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} pageContext={pageContext} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      pageContext,
      emotionStyleTags,
    };
  }

  render() {
    const { pageContext, emotionStyleTags } = this.props;

    return (
      <Html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />

          {/* PWA primary color */}
          {pageContext?.theme?.palette?.primary?.main && (
            <meta name="theme-color" content={pageContext.theme.palette.primary.main} />
          )}
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          {/* Inject MUI styles */}
          <meta name="emotion-insertion-point" content="" />
          {emotionStyleTags}

          {/* MathJax Script for rendering mathematical expressions */}
          {/*<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>*/}
          {/*<script type="text/javascript" src="https://app-asset-cdn.schoolcity.com/live/mathjax/MathJax-2.7.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>*/}
          {/*<script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>*/}

          {/*<script*/}
          {/*  type="text/x-mathjax-config"*/}
          {/*  dangerouslySetInnerHTML={{*/}
          {/*    // for mathjax 2.6.1*/}
          {/*    // __html: `*/}
          {/*    //   MathJax.Hub.Config({*/}
          {/*    //     tex2jax: {*/}
          {/*    //       inlineMath: [['$','$'], ['\\\\(','\\\\)']],*/}
          {/*    //       processEscapes: true*/}
          {/*    //     }*/}
          {/*    //   });*/}
          {/*    // `,*/}

          {/*    // for mathjax 2.7.2*/}
          {/*    // __html: `*/}
          {/*    // window.preventPIEtoOverwriteMathJax = true;*/}
          {/*    //   MathJax.Hub.Config({*/}
          {/*    //     tex2jax: {*/}
          {/*    //       inlineMath: [['\\\\(','\\\\)']]*/}
          {/*    //     },*/}
          {/*    //     MathML: {*/}
          {/*    //       extensions: [*/}
          {/*    //         "mml3.js",*/}
          {/*    //         "https://app-asset-cdn.schoolcity.com/live/mathjax/MathJax-2.7.2/extensions/TeX/mhchem.js"*/}
          {/*    //       ]*/}
          {/*    //     },*/}
          {/*    //     TeX: {*/}
          {/*    //       Macros: {*/}
          {/*    //         rightangle: "\\\\unicode{x0221F}",*/}
          {/*    //         rightanglewitharc: "\\\\unicode{x22be}",*/}
          {/*    //         rightanglewithcorner: "\\\\unicode{x0299C}",*/}
          {/*    //         righttriangle: "\\\\unicode{x022BF}"*/}
          {/*    //       }*/}
          {/*    //     },*/}
          {/*    //     showMathMenu: false,*/}
          {/*    //     messageStyle: "none"*/}
          {/*    //   });*/}
          {/*    //   MathJax.Hub.processSectionDelay = 0;*/}
          {/*    //   MathJax.Hub.processUpdateDelay = 0;*/}
          {/*    // `,*/}

          {/*    // for mathjax 3:*/}
          {/*    // __html: `*/}
          {/*    // MathJax = {*/}
          {/*    //   tex: {*/}
          {/*    //     inlineMath: [['$', '$'], ['\\\\(', '\\\\)']]*/}
          {/*    //   },*/}
          {/*    //   svg: {*/}
          {/*    //     fontCache: 'global'*/}
          {/*    //   }*/}
          {/*    // };`*/}
          {/*  }}*/}
          {/*></script>*/}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
