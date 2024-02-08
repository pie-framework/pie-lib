export const initializeMathJax = () => {
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
          resolve();
        },
      },
      loader: {
        load: ['input/mml'],
      },
      tex: {
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)'],
        ],
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
        processEscapes: true,
      },
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
  });
};
