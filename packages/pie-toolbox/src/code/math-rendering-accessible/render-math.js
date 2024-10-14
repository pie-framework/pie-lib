import { wrapMath, unWrapMath } from "./normalization";
import { SerializedMmlVisitor } from "mathjax-full/js/core/MmlTree/SerializedMmlVisitor";
import TexError from "mathjax-full/js/input/tex/TexError";

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

const renderContentsWithMathJax = (el) => {
  // el sometimes is an array
  // renderMath is used like that in pie-print-support and pie-element-extensions
  // there seems to be no reason for that, however, it's better to handle the case here
  if (el instanceof Array) {
    el.forEach(elNode => renderContentWithMathJax(elNode));
  } else {
    renderContentWithMathJax(el);
  }
};

const renderContentWithMathJax = (executeOn) => {
  executeOn = executeOn || document.body;

  // this happens for charting - mark-label; we receive a ref which is not yet ready ( el = { current: null })
  //  we have to fix this in charting
  if (!(executeOn instanceof HTMLElement)) return;

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
          removePlaceholdersAndRestoreDisplay();
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

const convertMathJax2ToMathJax3 = () => {
  // Make MathJax v2 compatible with v3
  //  https://docs.mathjax.org/en/v3.2-latest/upgrading/v2.html#version-2-compatibility-example
  //  Replace the require command map with a new one that checks for
  //    renamed extensions and converts them to the new names.
  const CommandMap = MathJax._.input.tex.SymbolMap.CommandMap;
  const requireMap = MathJax.config.startup.requireMap;
  const RequireLoad = MathJax._.input.tex.require.RequireConfiguration.RequireLoad;
  const RequireMethods = {
    Require: function(parser, name) {
      let required = parser.GetArgument(name);
      if (required.match(/[^_a-zA-Z0-9]/) || required === "") {
        throw new TexError("BadPackageName", "Argument for %1 is not a valid package name", name);
      }
      if (requireMap.hasOwnProperty(required)) {
        required = requireMap[required];
      }
      RequireLoad(parser, required);
    },
  };

  new CommandMap("require", { require: "Require" }, RequireMethods);

  //
  // Add a replacement for MathJax.Callback command
  //
  MathJax.Callback = function(args) {
    if (Array.isArray(args)) {
      if (args.length === 1 && typeof args[0] === "function") {
        return args[0];
      } else if (
        typeof args[0] === "string" &&
        args[1] instanceof Object &&
        typeof args[1][args[0]] === "function"
      ) {
        return Function.bind.apply(args[1][args[0]], args.slice(1));
      } else if (typeof args[0] === "function") {
        return Function.bind.apply(args[0], [window].concat(args.slice(1)));
      } else if (typeof args[1] === "function") {
        return Function.bind.apply(args[1], [args[0]].concat(args.slice(2)));
      }
    } else if (typeof args === "function") {
      return args;
    }
    throw Error("Can't make callback from given data");
  };

  //
  // Add a replacement for MathJax.Hub commands
  //
  MathJax.Hub = {
    Queue: function() {
      for (let i = 0, m = arguments.length; i < m; i++) {
        const fn = MathJax.Callback(arguments[i]);
        MathJax.startup.promise = MathJax.startup.promise.then(fn);
      }
      return MathJax.startup.promise;
    },
    Typeset: function(elements, callback) {
      let promise = MathJax.typesetPromise(elements);

      if (callback) {
        promise = promise.then(callback);
      }
      return promise;
    },
    Register: {
      MessageHook: function() {
        console.log("MessageHooks are not supported in version 3");
      },
      StartupHook: function() {
        console.log("StartupHooks are not supported in version 3");
      },
      LoadHook: function() {
        console.log("LoadHooks are not supported in version 3");
      },
    },
    Config: function() {
      console.log("MathJax configurations should be converted for version 3");
    },
  };
};
export const initializeMathJax = (callback) => {
  if (window.mathjaxLoadedP) {
    return;
  }

  const PreviousMathJaxIsUsed = window.MathJax && window.MathJax.version && window.MathJax.version !== MathJaxVersion && window.MathJax.version[0] === '2';

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

  if (PreviousMathJaxIsUsed) {
    texConfig.autoload = {
      color: [], // don't autoload the color extension
      colorv2: ["color"] // do autoload the colorv2 extension
    };
  }

  // Create a new promise that resolves when MathJax is ready
  window.mathjaxLoadedP = new Promise((resolve) => {
    // Set up the MathJax configuration
    window.MathJax = {
      startup: {
        //
        //  Mapping of old extension names to new ones
        //
        requireMap: PreviousMathJaxIsUsed
          ? {
              AMSmath: "ams",
              AMSsymbols: "ams",
              AMScd: "amscd",
              HTML: "html",
              noErrors: "noerrors",
              noUndefined: "noundefined"
            }
          : {},
        typeset: false,
        ready: () => {
          if (PreviousMathJaxIsUsed) {
            convertMathJax2ToMathJax3();
          }

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
            explorer: false,
          },
        },
      },
    };
    // Load the MathJax script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://cdn.jsdelivr.net/npm/mathjax@${MathJaxVersion}/es5/tex-chtml-full.js`;
    script.async = true;
    document.head.appendChild(script);

    // at this time of the execution, there's no document.body; setTimeout does the trick
    setTimeout(() => {
      if (!window.mathjaxLoadedComplete) {
        const mathElements = document?.body?.querySelectorAll("[data-latex]");
        (mathElements || []).forEach(createPlaceholder);
      }
    });
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
      renderContentsWithMathJax(el);
    } else if (window.mathjaxLoadedP) {
      //  However, because there is a small chance that MathJax was initialised by a previous version of math-rendering-accessible,
      //    we need to keep the old handling method, which means adding the .then.catch on window.mathjaxLoadedP Promise.
      // We still want to set window.mathjaxLoadedComplete, to prevent adding .then.catch after the first initialization
      //  (again, in case MathJax was initialised by a previous math-rendering-accessible version)
      window.mathjaxLoadedP
        .then(() => {
          window.mathjaxLoadedComplete = true;
          renderContentsWithMathJax(el);
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
