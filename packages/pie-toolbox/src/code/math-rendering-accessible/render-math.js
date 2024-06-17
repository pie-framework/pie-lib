import { initializeMathJax, getGlobal, mathRenderingAccessibleKEY } from './mathjax-script';
import { wrapMath, unWrapMath } from './normalization';
import * as mr from '../math-rendering';

import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor';

const visitor = new SerializedMmlVisitor();
const toMMl = (node) => visitor.visitTree(node);

const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = '\\newline ';

const mathRenderingKEY = '@pie-lib/math-rendering@2';

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

const createPlaceholder = (element) => {
  if (!element.previousSibling || !element.previousSibling.classList?.contains('math-placeholder')) {
    // Store the original display style before setting it to 'none'
    element.dataset.originalDisplay = element.style.display || '';
    element.style.display = 'none';

    const placeholder = document.createElement('span');
    placeholder.style.cssText =
      'height: 10px; width: 50px; display: inline-block; vertical-align: middle; justify-content: center; background: #fafafa; border-radius: 4px;';
    placeholder.classList.add('math-placeholder');
    element.parentNode?.insertBefore(placeholder, element);
  }
};

const removePlaceholdersAndRestoreDisplay = () => {
  document.querySelectorAll('.math-placeholder').forEach((placeholder) => {
    const targetElement = placeholder.nextElementSibling;

    if (targetElement && targetElement.dataset?.originalDisplay !== undefined) {
      targetElement.style.display = targetElement.dataset.originalDisplay;
      delete targetElement.dataset.originalDisplay;
    }

    placeholder.remove();
  });
};
const removeExcessMjxContainers = (content) => {
  const elements = content.querySelectorAll('[data-latex][data-math-handled="true"]');

  elements.forEach((element) => {
    const mjxContainers = element.querySelectorAll('mjx-container');

    // Check if there are more than one mjx-container children.
    if (mjxContainers.length > 1) {
      for (let i = 1; i < mjxContainers.length; i++) {
        mjxContainers[i].parentNode.removeChild(mjxContainers[i]);
      }
    }
  });
};

const getMathJaxCustomKey = () => window?.MathJax?.customKey || window?.MathJax?.config?.customKey;

const renderMath = (el, renderOpts) => {
  const isString = typeof el === 'string';
  let executeOn = document.body;

  if (isString) {
    const div = document.createElement('div');

    div.innerHTML = el;
    executeOn = div;
  }

  const { skipWaitForMathRenderingLib } = renderOpts || {};

  // this is the actual math-rendering-accessible renderMath function, which initialises MathJax
  const renderMathAccessible = () => {
    fixMathElements(executeOn);
    adjustMathMLStyle(executeOn);

    const mathJaxCustomKey = getMathJaxCustomKey();

    if (
      (!window.MathJax && !window.mathjaxLoadedP) ||
      (mathJaxCustomKey && mathJaxCustomKey !== mathRenderingAccessibleKEY)
    ) {
      renderOpts = renderOpts || defaultOpts();

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
            // Reset the tex labels (and automatic equation number).

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
                  removeExcessMjxContainers(executeOn);
                  removePlaceholdersAndRestoreDisplay();

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

  // skipWaitForMathRenderingLib is used currently in editable-html, when mmlOutput is enabled
  if (skipWaitForMathRenderingLib) {
    // is this case, we don't need to wait for anything, because a math-instance is most probably already loaded
    return renderMathAccessible();
  } else {
    // Check immediately if the math-rendering package is available, and if it is, use it
    if (window.hasOwnProperty(mathRenderingKEY) && window[mathRenderingKEY].instance) {
      removePlaceholdersAndRestoreDisplay();

      return mr.renderMath(executeOn, renderOpts);
    }

    // Check immediately if the math-rendering-accessible package is available, and if it is, use it
    if (window.hasOwnProperty(mathRenderingAccessibleKEY) && window[mathRenderingAccessibleKEY].instance) {
      return renderMathAccessible();
    }

    const waitForMathRenderingLib = (renderMathAccessibleCallback) => {
      // Create placeholders for the items while math is loading
      const mathElements = executeOn.querySelectorAll('[data-latex]');
      mathElements.forEach(createPlaceholder);

      let checkIntervalId;
      const maxWaitTime = 500;
      const startTime = Date.now();

      const checkForLib = () => {
        // Check if library has loaded or if the maximum wait time has been exceeded
        const mathRenderingHasLoaded = window.hasOwnProperty(mathRenderingKEY) && window[mathRenderingKEY].instance;
        const hasExceededMaxWait = Date.now() - startTime > maxWaitTime;

        if (mathRenderingHasLoaded || hasExceededMaxWait) {
          clearInterval(checkIntervalId);

          // Check if the math-rendering package is available, and if it is, use it
          if (mathRenderingHasLoaded) {
            removePlaceholdersAndRestoreDisplay();

            return mr.renderMath(executeOn, renderOpts);
          }

          renderMathAccessibleCallback();
        }
      };

      // Start periodically checking for math-rendering
      checkIntervalId = setInterval(checkForLib, 100);
    };

    // otherwise, we need for it to load
    waitForMathRenderingLib(renderMathAccessible);
  }
};

export default renderMath;
