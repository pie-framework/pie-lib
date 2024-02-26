import { getGlobal } from './render-math';

// Debounce function: Executes the function after a specified time if it's not called again during that time
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const initializeMathJax = (renderOpts) => {
  return new Promise((resolve, reject) => {
    console.log(window, 'window in the script');

    const debouncedInitialization = debounce(() => {
      console.log(window, 'window in the script');

      if (window.hasOwnProperty('@pie-lib/math-rendering@2')) {
        console.log('use math rendering and return -------------------');
        // Remove existing MathJax instance

        console.log(window.MathJax, 'mathjax in script------------');
        // delete window.MathJax;
        // delete window['@pie-lib/math-rendering@2'];
        //  return;
      }

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
      window.mathjaxLoadedP = new Promise((innerResolve) => {
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

        script.onload = () => {
          console.log('MathJax script loaded');
          innerResolve();
        };

        script.onerror = () => {
          console.error('Error loading MathJax script');
          resolve(); // Resolve anyway to prevent hanging promises
        };
      });
    }, 1000);

    debouncedInitialization();
  });
};
