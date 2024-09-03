import { getGlobal } from './render-math';

export const MathJaxVersion = '3.2.2';
export const mathRenderingKEY = '@pie-lib/math-rendering@2';
export const mathRenderingAccessibleKEY = '@pie-lib/math-rendering-accessible@1';

const getMathJaxCustomKey = () => window?.MathJax?.customKey || window?.MathJax?.config?.customKey;
const mathJaxCustomKey = getMathJaxCustomKey();

/** Add temporary support for a global singleDollar override
 *  <code>
 *   // This will enable single dollar rendering
 *   window.pie = window.pie || {};
 *   window.pie.mathRendering =  {useSingleDollar: true };
 *  </code>
 */
const defaultOpts = () => getGlobal().opts || {};

export const initializeMathJax = (renderOpts, callback) => {
  window.MathJaxInitialised = true;

  renderOpts = renderOpts || defaultOpts();

  // In OT, they are loading MathJax version 2.6.1, which prevents our MathJax initialization, so our ietms are not working properly
  // that's why we want to initialize MathJax if the existing version is different than what we need
  if (
    ((!window.MathJax || window.MathJax.version !== MathJaxVersion) && !window.mathjaxLoadedP) ||
    (mathJaxCustomKey && mathJaxCustomKey !== mathRenderingAccessibleKEY)
  ) {
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

          if (callback) {
            callback();
          }

          window.MathJaxLoaded = true;
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
    script.src = `https://cdn.jsdelivr.net/npm/mathjax@${MathJaxVersion}/es5/tex-chtml-full.js`;
    script.async = true;
    document.body.appendChild(script);
  }
};
