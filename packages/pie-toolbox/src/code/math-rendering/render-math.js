import { initializeMathJax } from './mathjax-script';
import { wrapMath, unWrapMath } from './normalization';

const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = '\\newline ';

export const fixMathElement = (element) => {
  if (element.dataset.mathHandled) {
    return;
  }

  let property = 'innerText';

  if (element.textContent) {
    property = 'textContent';
  }

  if (element[property]) {
    element[property] = wrapMath(unWrapMath(element[property]).unwrapped);
    // because mathquill doesn't understand line breaks, sometimes we end up with custom elements on prompts/rationale/etc.
    // we need to replace the custom embedded elements with valid latex that Mathjax can understand
    element[property] = element[property].replace(NEWLINE_BLOCK_REGEX, NEWLINE_LATEX);
    element.dataset.mathHandled = true;
  }
};

export const fixMathElements = (el = document) => {
  const mathElements = el.querySelectorAll('[data-latex]');

  mathElements.forEach((item) => fixMathElement(item));
};

const renderMath = (el) => {
  let executeOn = document.body;
  fixMathElements(executeOn);

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
              //console.log('Element after typesetting:', el.innerHTML);
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
