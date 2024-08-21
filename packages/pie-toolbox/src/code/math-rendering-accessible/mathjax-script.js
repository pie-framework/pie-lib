export const MathJaxVersion = "3.2.2";
export const getMathJaxCustomKey = () => window?.MathJax?.customKey || window?.MathJax?.config?.customKey;

export const mathRenderingKEY = "@pie-lib/math-rendering@2";
export const mathRenderingAccessibleKEY = "@pie-lib/math-rendering-accessible@1";

export const getGlobal = () => {
  // TODO does it make sense to use version?
  // const key = `${pkg.name}@${pkg.version.split('.')[0]}`;
  // It looks like Ed made this change when he switched from mathjax3 to mathjax-full
  // I think it was supposed to make sure version 1 (using mathjax3) is not used
  // in combination with version 2 (using mathjax-full)
  // TODO higher level wrappers use this instance of math-rendering, and if 2 different instances are used, math rendering is not working
  //  so I will hardcode this for now until a better solution is found
  if (typeof window !== 'undefined') {
    if (!window[mathRenderingAccessibleKEY]) {
      window[mathRenderingAccessibleKEY] = {};
    }
    return window[mathRenderingAccessibleKEY];
  } else {
    return {};
  }
};


/** Add temporary support for a global singleDollar override
 *  <code>
 *   // This will enable single dollar rendering
 *   window.pie = window.pie || {};
 *   window.pie.mathRendering =  {useSingleDollar: true };
 *  </code>
 */
const defaultOpts = () => getGlobal().opts || {};

export const initializeMathJax = (renderOpts, applyMathJax) => {
  // set in a previous version
  if (window.mathjaxLoadedP) return;

  const mathJaxCustomKey = getMathJaxCustomKey();

  const noMathJax = !window.MathJax;
  const differentMathJaxVersion = window.MathJax && window.MathJax.version !== MathJaxVersion;

  // In OT, they are loading MathJax version 2.6.1, which prevents our MathJax initialization, so our ietms are not working properly
  // that's why we want to initialize MathJax if the existing version is different than what we need
  if (
    ((noMathJax || differentMathJaxVersion) && !window.MathJaxInitialized) ||
    (mathJaxCustomKey && mathJaxCustomKey !== mathRenderingAccessibleKEY)
  ) {
    renderOpts = renderOpts || defaultOpts();

    if (renderOpts?.useSingleDollar) {
      // eslint-disable-next-line
      console.warn("[math-rendering] using $ is not advisable, please use $$..$$ or \\(...\\)");
    }

    const texConfig = renderOpts?.useSingleDollar
      ? {
        macros: {
          parallelogram: "\\lower.2em{\\Huge\\unicode{x25B1}}",
          overarc: "\\overparen",
          napprox: "\\not\\approx",
          longdiv: "\\enclose{longdiv}"
        },
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"]
        ],
        processEscapes: true,
        displayMath: [
          ["$$", "$$"],
          ["\\[", "\\]"]
        ]
      }
      : {
        macros: {
          parallelogram: "\\lower.2em{\\Huge\\unicode{x25B1}}",
          overarc: "\\overparen",
          napprox: "\\not\\approx",
          longdiv: "\\enclose{longdiv}"
        },
        displayMath: [
          ["$$", "$$"],
          ["\\[", "\\]"]
        ]
      };

    window.MathJaxInitialized = true;

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

          window.MathJaxFullyLoaded = true;

          if (applyMathJax) {
            applyMathJax();
          }
        }
      },
      loader: {
        load: ["input/mml"]
      },
      tex: texConfig,
      chtml: {
        fontURL: "https://unpkg.com/mathjax-full@3.2.2/ts/output/chtml/fonts/tex-woff-v2",
        displayAlign: "center"
      },
      customKey: "@pie-lib/math-rendering-accessible@1",
      options: {
        enableEnrichment: true,
        sre: {
          speech: "deep"
        },
        menuOptions: {
          settings: {
            assistiveMml: true,
            collapsible: false,
            explorer: false
          }
        }
      }
    };
    // Load the MathJax script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://cdn.jsdelivr.net/npm/mathjax@${MathJaxVersion}/es5/tex-chtml-full.js`;
    script.async = true;
    document.head.appendChild(script);
  }
};
