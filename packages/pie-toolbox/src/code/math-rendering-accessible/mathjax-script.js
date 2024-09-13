import { getGlobal } from './render-math';

export const MathJaxVersion = '3.2.2';

export const initializeMathJax = (renderOpts, callback) => {
  if (renderOpts?.useSingleDollar) {
    // eslint-disable-next-line
    console.warn('[math-rendering] using $ is not advisable, please use $$..$$ or \\(...\\)');
  }

  const texConfig = renderOpts?.useSingleDollar
    ? {
        macros: {
          parallelogram: '\\lower.2em{\\Huge\\unicode{x25B1}}',
          overarc: '\\overparen',
          napprox: '\\not\\approx',
          longdiv: '\\enclose{longdiv}',
        },
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)'],
        ],
        processEscapes: true,
        displayMath: [
          ['$$', '$$'],
          ['\\[', '\\]'],
        ],
      }
    : {
        macros: {
          parallelogram: '\\lower.2em{\\Huge\\unicode{x25B1}}',
          overarc: '\\overparen',
          napprox: '\\not\\approx',
          longdiv: '\\enclose{longdiv}',
        },
        displayMath: [
          ['$$', '$$'],
          ['\\[', '\\]'],
        ],
      };

  // Create a new promise that resolves when MathJax is ready
  window.mathjaxLoadedP = new Promise((resolve) => {
    // Set up the MathJax configuration
    window.MathJax = {
      startup: {
        typeset: false,
        ready: () => {
          const { mathjax } = MathJax._.mathjax;
          const { STATE } = MathJax._.core.MathItem;
          const { Menu } = MathJax._.ui.menu.Menu;
          const rerender = Menu.prototype.rerender;
          Menu.prototype.rerender = function(start = STATE.TYPESET) {
            mathjax.handleRetriesFor(() => rerender.call(this, start));
          };
          MathJax.startup.defaultReady();
          // Set the MathJax instance in the global object
          const globalObj = getGlobal();
          globalObj.instance = MathJax;

          window.mathjaxIsInitialised = true;

          if (callback) {
            callback();
          } else {
            resolve();
          }
        },
      },
      loader: {
        load: ['input/mml'],
        // I just added preLoad: () => {} to prevent the console error: "MathJax.loader.preLoad is not a function",
        //  which is being called because in math-rendering-accessible/render-math we're having this line:
        //  import * as mr from '../math-rendering';
        //  which takes us to: import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
        //  which tries to call MathJax.loader.preLoad.
        // Understand that AllPackages is NOT needed in math-rendering-accessible, so it is not a problem if we hardcode this function.
        // The better solution would be for math-rendering-accessible to import math-rendering only IF needed,
        //  but that's actually complicated and could cause other issues.
        preLoad: () => {},
      },
      tex: texConfig,
      chtml: {
        fontURL: 'https://unpkg.com/mathjax-full@3.2.2/ts/output/chtml/fonts/tex-woff-v2',
        displayAlign: 'center',
      },
      customKey: '@pie-lib/math-rendering-accessible@1',
      options: {
        enableEnrichment: true,
        sre: {
          speech: 'deep',
        },
        menuOptions: {
          settings: {
            assistiveMml: true,
            collapsible: false,
            explorer: false,
          },
        },
      },
    };
    // Load the MathJax script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://cdn.jsdelivr.net/npm/mathjax@${MathJaxVersion}/es5/tex-chtml-full.js`;
    script.async = true;
    document.body.appendChild(script);
  });
};
