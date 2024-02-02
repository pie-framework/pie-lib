import { initializeMathJax } from './mathjax-script';
import { wrapMath, unWrapMath } from './normalization';

import { MmlFactory } from 'mathjax-full/js/core/MmlTree/MmlFactory';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor';
const visitor = new SerializedMmlVisitor();
const toMMl = (node) => visitor.visitTree(node);

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

const adjustMathMLStyle = (el = document) => {
  const nodes = el.querySelectorAll('math');
  nodes.forEach((node) => node.setAttribute('displaystyle', 'true'));
};

const renderMath = (el, renderOpts) => {
  const isString = typeof el === 'string';
  let executeOn = document.body;

  if (isString) {
    const div = document.createElement('div');

    div.innerHTML = el;
    executeOn = div;

    console.log(isString, 'is string');
  }

  fixMathElements(executeOn);
  adjustMathMLStyle(executeOn);

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

          //  Reset the tex labels (and automatic equation number).
          window.MathJax.texReset();

          //  Reset the typesetting system (font caches, etc.)
          window.MathJax.typesetClear();

          // Use typesetPromise for asynchronous typesetting
          // Using MathJax.typesetPromise() for asynchronous typesetting to handle situations where additional code needs to be loaded (e.g., for certain TeX commands or characters).
          // This ensures typesetting waits for any needed resources to load and complete processing, unlike the synchronous MathJax.typeset() which can't handle such dynamic loading.
          window.MathJax.typesetPromise([el])
            .then(() => {
              //console.log('Element after typesetting:', el.innerHTML);
              try {
                const updatedDocument = window.MathJax.startup.document;
                const list = updatedDocument.math.list;

                for (let item = list.next; typeof item.data !== 'symbol'; item = item.next) {
                  const mathMl = toMMl(item.data.root);
                  const parsedMathMl = mathMl.replaceAll('\n', '');

                  item.data.typesetRoot.setAttribute('data-mathml', parsedMathMl);
                }
              } catch (e) {
                console.error('Error post-processing MathJax typesetting:', e.toString());
              }
              // Clearing the document if needed
              window.MathJax.startup.document.clear();
            })
            .catch((error) => {
              //  If there was an internal error, put the message into the output instead

              output.innerHTML = '';
              output.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));

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
