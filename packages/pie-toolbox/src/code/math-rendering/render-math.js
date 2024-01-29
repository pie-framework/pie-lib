import { initializeMathJax } from './mathjax-script';

const renderMath = (el) => {
  if (!window.MathJax && !window.mathjaxLoadedP) {
    console.log('Initializing MathJax...');
    initializeMathJax();
  }

  if (window.mathjaxLoadedP) {
    window.mathjaxLoadedP
      .then(() => {
        console.log('MathJax is ready, typesetting element');
        if (window.MathJax) {
          // Reset and clear typesetting before processing the new content
          window.MathJax.texReset();
          window.MathJax.typesetClear();

          // Use typesetPromise for asynchronous typesetting
          window.MathJax.typesetPromise([el])
            .then(() => {
              console.log('Element after typesetting:', el.innerHTML);
            })
            .catch((error) => {
              console.error('Error in typesetting with MathJax:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error in initializing MathJax:', error);
      });
  }
};

export default renderMath;
