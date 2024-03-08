import { initializeMathJax } from './mathjax-script';
import { wrapMath, unWrapMath } from './normalization';

import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor';

const visitor = new SerializedMmlVisitor();
const toMMl = (node) => visitor.visitTree(node);

const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = '\\newline ';

export const getGlobal = () => {
  // TODO does it make sense to use version?
  // const key = `${pkg.name}@${pkg.version.split('.')[0]}`;
  // It looks like Ed made this change when he switched from mathjax3 to mathjax-full
  // I think it was supposed to make sure version 1 (using mathjax3) is not used
  // in combination with version 2 (using mathjax-full)

  // TODO higher level wrappers use this instance of math-rendering, and if 2 different instances are used, math rendering is not working
  //  so I will hardcode this for now until a better solution is found
  const key = '@pie-lib/math-rendering-accessible@1';

  if (typeof window !== 'undefined') {
    if (!window[key]) {
      window[key] = {};
    }
    return window[key];
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
  renderOpts = renderOpts || defaultOpts();

  const isString = typeof el === 'string';
  let executeOn = document.body;

  if (isString) {
    const div = document.createElement('div');

    div.innerHTML = el;
    executeOn = div;
  }

  fixMathElements(executeOn);
  adjustMathMLStyle(executeOn);

  if (window?.hasOwnProperty('@pie-lib/math-rendering@2')) {
    // Check if MathJax is instantiated by the math-rendering module
    // If true, use the math-rendering instance and return
    return;
  }

  if (!window.MathJax && !window.mathjaxLoadedP) {
    initializeMathJax(renderOpts);
  }

  if (isString && window.MathJax && window.mathjaxLoadedP) {
    try {
      MathJax.texReset();
      MathJax.typesetClear();
      window.MathJax.typeset([executeOn]);
      const updatedDocument = window.MathJax.startup.document;
      const list = updatedDocument.math.list;
      const item = list.next;
      const mathMl = toMMl(item.data.root);

      const parsedMathMl = mathMl.replaceAll('\n', '');

      return parsedMathMl;
    } catch (error) {
      console.error('Error rendering math:', error.message);
    }
  }

  if (window.mathjaxLoadedP) {
    window.mathjaxLoadedP
      .then(() => {
        const mathJaxInstance = getGlobal().instance;

        if (mathJaxInstance) {
          // Reset and clear typesetting before processing the new content

          //  Reset the tex labels (and automatic equation number).
          mathJaxInstance.texReset();

          //  Reset the typesetting system (font caches, etc.)
          mathJaxInstance.typesetClear();

          // Use typesetPromise for asynchronous typesetting
          // Using MathJax.typesetPromise() for asynchronous typesetting to handle situations where additional code needs to be loaded (e.g., for certain TeX commands or characters).
          // This ensures typesetting waits for any needed resources to load and complete processing, unlike the synchronous MathJax.typeset() which can't handle such dynamic loading.
          mathJaxInstance
            .typesetPromise([executeOn])
            .then(() => {
              try {
                const updatedDocument = mathJaxInstance.startup.document;
                const list = updatedDocument.math.list;

                for (let item = list.next; typeof item.data !== 'symbol'; item = item.next) {
                  const mathMl = toMMl(item.data.root);
                  const parsedMathMl = mathMl.replaceAll('\n', '');

                  item.data.typesetRoot.setAttribute('data-mathml', parsedMathMl);
                }
                // If the original input was a string, return the parsed MathML
              } catch (e) {
                console.error('Error post-processing MathJax typesetting:', e.toString());
              }

              // Clearing the document if needed
              mathJaxInstance.startup.document.clear();
            })
            .catch((error) => {
              //  If there was an internal error, put the message into the output instead

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
