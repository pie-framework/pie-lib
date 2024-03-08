import { getGlobal } from './render-math';

export const initializeMathJax = (renderOpts) => {
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
          resolve();
        },
      },
      loader: {
        load: ['input/mml'],
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
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml-full.js';
    script.async = true;
    document.body.appendChild(script);
  });
};
