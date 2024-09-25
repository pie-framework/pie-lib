import { wrapMath, unWrapMath } from "./normalization";
import { SerializedMmlVisitor } from "mathjax-full/js/core/MmlTree/SerializedMmlVisitor";

const visitor = new SerializedMmlVisitor();
const toMMl = (node) => visitor.visitTree(node);

const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = "\\newline ";

const mathRenderingKEY = "@pie-lib/math-rendering@2";
const mathRenderingAccessibleKEY = "@pie-lib/math-rendering-accessible@1";

export const MathJaxVersion = "3.2.2";

export const getGlobal = () => {
  // TODO does it make sense to use version?
  // const key = `${pkg.name}@${pkg.version.split('.')[0]}`;
  // It looks like Ed made this change when he switched from mathjax3 to mathjax-full
  // I think it was supposed to make sure version 1 (using mathjax3) is not used
  // in combination with version 2 (using mathjax-full)
  // TODO higher level wrappers use this instance of math-rendering, and if 2 different instances are used, math rendering is not working
  //  so I will hardcode this for now until a better solution is found
  if (typeof window !== "undefined") {
    if (!window[mathRenderingAccessibleKEY]) {
      window[mathRenderingAccessibleKEY] = {};
    }
    return window[mathRenderingAccessibleKEY];
  } else {
    return {};
  }
};

export const fixMathElement = (element) => {
  if (element.dataset.mathHandled) {
    return;
  }

  let property = "innerText";

  if (element.textContent) {
    property = "textContent";
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
  const mathElements = el.querySelectorAll("[data-latex]");

  mathElements.forEach((item) => fixMathElement(item));
};

const adjustMathMLStyle = (el = document) => {
  const nodes = el.querySelectorAll("math");
  nodes.forEach((node) => node.setAttribute("displaystyle", "true"));
};

const createPlaceholder = (element) => {
  if (!element.previousSibling || !element.previousSibling.classList?.contains("math-placeholder")) {
    // Store the original display style before setting it to 'none'
    element.dataset.originalDisplay = element.style.display || "";
    element.style.display = "none";

    const placeholder = document.createElement("span");
    placeholder.style.cssText =
      "height: 10px; width: 50px; display: inline-block; vertical-align: middle; justify-content: center; background: #fafafa; border-radius: 4px;";
    placeholder.classList.add("math-placeholder");
    element.parentNode?.insertBefore(placeholder, element);
  }
};

const removePlaceholdersAndRestoreDisplay = () => {
  document.querySelectorAll(".math-placeholder").forEach((placeholder) => {
    const targetElement = placeholder.nextElementSibling;

    if (targetElement && targetElement.dataset?.originalDisplay !== undefined) {
      targetElement.style.display = targetElement.dataset.originalDisplay;
      delete targetElement.dataset.originalDisplay;
    }

    placeholder.remove();
  });
};
const removeExcessMjxContainers = (content) => {
  const elements = content.querySelectorAll("[data-latex][data-math-handled=\"true\"]");

  elements.forEach((element) => {
    const mjxContainers = element.querySelectorAll("mjx-container");

    // Check if there are more than one mjx-container children.
    if (mjxContainers.length > 1) {
      for (let i = 1; i < mjxContainers.length; i++) {
        mjxContainers[i].parentNode.removeChild(mjxContainers[i]);
      }
    }
  });
};

const renderContentWithMathJax = (executeOn) => {
  executeOn = executeOn || document.body;

  fixMathElements(executeOn);
  adjustMathMLStyle(executeOn);

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

          const updatedDocument = mathJaxInstance.startup.document;
          const list = updatedDocument.math.list;

          for (let item = list.next; typeof item.data !== 'symbol'; item = item.next) {
            const mathMl = toMMl(item.data.root);
            const parsedMathMl = mathMl.replaceAll("\n", "");

            item.data.typesetRoot.setAttribute("data-mathml", parsedMathMl);
          }

          // If the original input was a string, return the parsed MathML
        } catch (e) {
          console.error("Error post-processing MathJax typesetting:", e.toString());
        }

        // Clearing the document if needed
        mathJaxInstance.startup.document.clear();
      })
      .catch((error) => {
        //  If there was an internal error, put the message into the output instead

        console.error("Error in typesetting with MathJax:", error);
      });
  }
};

export const initializeMathJax = (callback) => {
  const texConfig = {
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
          // Set the MathJax instance in the global object

          const globalObj = getGlobal();
          globalObj.instance = MathJax;

          window.mathjaxLoadedComplete = true;
          console.log("MathJax has initialised!", new Date().toString());

          // in this file, initializeMathJax is called with a callback that has to be executed when MathJax was loaded
          if (callback) {
            callback();
          }

          // but previous versions of math-rendering-accessible they're expecting window.mathjaxLoadedP to be a Promise, so we also keep the
          //  resolve here;
          resolve();
        },
      },
      loader: {
        load: ["input/mml"],
        // I just added preLoad: () => {} to prevent the console error: "MathJax.loader.preLoad is not a function",
        //  which is being called because in math-rendering-accessible/render-math we're having this line:
        //  import * as mr from '../math-rendering';
        //  which takes us to: import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
        //  which tries to call MathJax.loader.preLoad.
        // Understand that AllPackages is NOT needed in math-rendering-accessible, so it is not a problem if we hardcode this function.
        // The better solution would be for math-rendering-accessible to import math-rendering only IF needed,
        //  but that's actually complicated and could cause other issues.
        preLoad: () => {},
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
    document.body.appendChild(script);
  });
};

const renderMath = (el, renderOpts) => {
  const usedForMmlOutput = typeof el === "string";
  let executeOn = document.body;

  if (!usedForMmlOutput) {
    // If math-rendering was not available, then:
    //  If window.mathjaxLoadedComplete, it means that we initialised MathJax using the function from this file,
    //  and it means MathJax is successfully completed, so we can already use it
    if (window.mathjaxLoadedComplete) {
      renderContentWithMathJax(el);
    } else if (window.mathjaxLoadedP) {
      //  However, because there is a small chance that MathJax was initialised by a previous version of math-rendering-accessible,
      //    we need to keep the old handling method, which means adding the .then.catch on window.mathjaxLoadedP Promise.
      // We still want to set window.mathjaxLoadedComplete, to prevent adding .then.catch after the first initialization
      //  (again, in case MathJax was initialised by a previous math-rendering-accessible version)
      window.mathjaxLoadedP
        .then(() => {
          window.mathjaxLoadedComplete = true;
          renderContentWithMathJax(el);
        })
        .catch((error) => console.error("Error in initializing MathJax:", error));
    }
  } else {
    // Here we're handling the case when renderMath is being called for mmlOutput
    if (window.MathJax && window.mathjaxLoadedP) {
      const div = document.createElement("div");

      div.innerHTML = el;
      executeOn = div;

      try {
        MathJax.texReset();
        MathJax.typesetClear();
        window.MathJax.typeset([executeOn]);
        const updatedDocument = window.MathJax.startup.document;
        const list = updatedDocument.math.list;
        const item = list.next;
        const mathMl = toMMl(item.data.root);

        const parsedMathMl = mathMl.replaceAll("\n", "");

        return parsedMathMl;
      } catch (error) {
        console.error("Error rendering math:", error.message);
      }

      return el;
    }

    return el;
  }
};

// this function calls itself
(function() {
  initializeMathJax(renderContentWithMathJax);

  window[mathRenderingKEY] = {
    instance: {
      Typeset: renderMath,
    },
  };
})();

export default renderMath;
