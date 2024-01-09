import { useEffect } from 'react';

const useMathJax = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Creating a global promise that can be used to
      // ascertain if MathJax is ready
      window.mathjaxLoadedP = new Promise(function(resolve) {
        // The window.MathJax object should be created
        // BEFORE loading MathJax for it to take effect
        window.MathJax = {
          startup: {
            // Stop MathJax from auto-typesetting the page,
            // we'll trigger it as needed
            typeset: false,
            ready: function() {
              MathJax.startup.defaultReady();
              resolve();
            },
          },
          options: {
            enableEnrichment: true,
            sre: {
              speech: 'deep',
            },
            menuOptions: {
              settings: {
                assistiveMml: true,
                // Clicking on math, collapses it. Turn this behaviour off by default
                // because it doesen't play well with "click and drop" interaction.
                // However, the user may turn it on using the MathJax context menu.
                collapsible: false,
                // Turning `explorer: off` because it adds `role="application"` to the `mjx-container` which makes some screen readers not identify content as Math.
                explorer: false,
              },
            },
          },
        };
      });
      
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export default useMathJax;
