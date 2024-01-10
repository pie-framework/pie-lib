export const initializeMathJax = () => {
  // Create a new promise that resolves when MathJax is ready
  window.mathjaxLoadedP = new Promise((resolve) => {
    // Set up the MathJax configuration
    window.MathJax = {
      startup: {
        typeset: false,
        ready: () => {
          MathJax.startup.defaultReady();
          resolve(); // Resolve the promise here
        },
      },
      // loader: {
      //   load: ['input/tex', 'output/chtml']
      // },
      // tex: {
      //   inlineMath: [['$', '$'], ['\\(', '\\)']],
      //   displayMath: [['$$', '$$'], ['\\[', '\\]']],
      //   processEscapes: true
      // },
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

