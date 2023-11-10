import React from 'react';
import { Editor, Inline, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import Functions from '@material-ui/icons/Functions';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath, unWrapMath, mmlToLatex, renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { BLOCK_TAGS } from '../../new-serialization';
const log = debug('@pie-lib:editable-html:plugins:math');

const TEXT_NODE = 3;

function generateAdditionalKeys(keyData = []) {
  return keyData.map((key) => ({
    name: key,
    latex: key,
    write: key,
    label: key,
  }));
}

// eslint-disable-next-line react/display-name
export const CustomToolbarComp = React.memo(
  (props) => {
    const { node, nodePath, onFocus, onBlur, onClick, editor } = props;
    const { pluginProps } = props || {};
    const { math } = pluginProps || {};
    const { keypadMode, customKeys, controlledKeypadMode = true } = math || {};

    const onDone = (latex) => {
      const update = {
        ...node.data,
        latex,
      };
      editor.apply({
        type: 'set_node',
        path: nodePath,
        properties: {
          data: node.data,
        },
        newProperties: { data: update },
      });
      ReactEditor.focus(editor);
      Transforms.move(editor, { distance: 1, unit: 'offset' });
    };

    const latex = node.data.latex;

    return (
      <MathToolbar
        autoFocus
        additionalKeys={generateAdditionalKeys(customKeys)}
        latex={latex}
        onDone={onDone}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        keypadMode={keypadMode}
        controlledKeypadMode={controlledKeypadMode}
      />
    );
  },
  (prev, next) => {
    const { node, pluginProps: { math: { keypadMode, controlledKeypadMode } = {} } = {} } = prev;
    const {
      node: nodeNext,
      pluginProps: { math: { keypadMode: keypadModeNext, controlledKeypadMode: controlledKeypadModeNext } = {} } = {},
    } = next;
    const keypadModeChanged = keypadMode !== keypadModeNext;
    const controlledKeypadModeChanged = controlledKeypadMode !== controlledKeypadModeNext;

    const equal = isEqual(node, nodeNext);
    return equal && !keypadModeChanged && !controlledKeypadModeChanged;
  },
);

CustomToolbarComp.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.shape({
    type: PropTypes.string,
    children: PropTypes.array,
    data: PropTypes.object,
  }).isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      children: PropTypes.array,
      data: PropTypes.object,
    }),
  ).isRequired,
  onToolbarDone: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
};

const mathTypes = ['math', 'mathml'];

export default function MathPlugin(opts) {
  MathPlugin.mathMlOptions = {
    mmlOutput: opts.mmlOutput,
    mmlEditing: opts.mmlEditing,
  };

  return {
    name: 'math',
    toolbar: {
      icon: <Functions />,
      onClick: (editor) => {
        log('[insertMath]');
        const math = inlineMath();

        editor.insertNode(math);
      },
      /**
       * Return a react component function
       * @param node {Slate.Node}
       * @param value {Slate.Value}
       * @param onDone {(change?: Slate.Change, finishEditing :boolea) => void} - a function to call once the toolbar
       *   has made any changes, call with the node.key and a data object.
       */
      CustomToolbarComp,
    },
    rules: (editor) => {
      const { isVoid, isInline } = editor;

      editor.isVoid = (element) => {
        return mathTypes.includes(element.type) ? true : isVoid(element);
      };

      editor.isInline = (element) => {
        return mathTypes.includes(element.type) ? true : isInline(element);
      };

      return editor;
    },
    supports: (node) => mathTypes.includes(node.type),
    schema: {
      document: { match: [{ type: 'math' }] },
    },

    pluginStyles: (node, parentNode, p) => {
      if (p) {
        return {
          position: 'absolute',
          top: 'initial',
        };
      }
    },

    renderNode: (props) => {
      if (props.node.type === 'math') {
        log('[renderNode]: data:', props.node.data);
        return <MathPreview {...props} />;
      }

      /**
       * Here for rendering mathml content
       */
      if (props.node.type === 'mathml') {
        const {
          data: { html },
        } = props.node;

        return (
          <span>
            <span {...props.attributes} contentEditable={false} dangerouslySetInnerHTML={{ __html: html }} />
            {props.children}
          </span>
        );
      }
    },
  };
}

MathPlugin.ROUND_BRACKETS = 'round_brackets';
MathPlugin.SQUARE_BRACKETS = 'square_brackets';
MathPlugin.DOLLAR = 'dollar';
MathPlugin.DOUBLE_DOLLAR = 'double_dollar';
MathPlugin.mathMlOptions = {};

MathPlugin.propTypes = {
  attributes: PropTypes.object,
  node: PropTypes.node,
};

export const inlineMath = () => ({
  type: 'math',
  data: {
    latex: '',
  },
  children: [{ text: '' }],
});

const htmlDecode = (input) => {
  const doc = new DOMParser().parseFromString(input, 'text/html');

  return doc.documentElement.textContent;
};

const getTagName = (el) => {
  return ((el && el.tagName) || '').toLowerCase();
};

/**
 * Makes sure that strings that contain stuff like:
 * x<y are not transformed into x by the DOMParser because it thinks
 * that <y is the start of a dom element tag
 * @param input
 * @returns {*}
 */
const lessThanHandling = (input) => {
  const arrowSplit = input.split('<');

  // if we don't have at least 2 characters there's no point in checking
  if (input.length > 2) {
    return arrowSplit.reduce((st, part) => {
      /*
       We check if this element resulted is:
       div - continuation of a beginning of a HTML element
       /div - closing of a HTML tag
       br/> - beginning and closing of a html TAG
       */
      if (part.match(/<[a-zA-Z/][\s\S]*>/gi)) {
        return `${st}${st ? '<' : ''}${part}`;
      }

      return `${st}${st ? '&lt;' : ''}${part}`;
    }, '');
  }

  return input;
};

export const serialization = {
  deserialize(el, children) {
    const tagName = getTagName(el);
    /**
     * This is used for when there's a wrapper over the mathml element.
     * Because of this slate rule: "Only allow block nodes or inline and text nodes in blocks."
     * The element that contains only the mathml is removed (along with the math) because it has
     * an inline child and the block is of type block
     * This is for legacy content only since our math rendering is valid for the core slate rules
     */
    const hasMathChild = BLOCK_TAGS[tagName] && el.childNodes.length === 1 && getTagName(el.firstChild) === 'math';
    log('[deserialize] name: ', tagName);

    /**
     * This is here in order to be able to render mathml content
     */
    if (tagName === 'math' || (el.dataset && el.dataset.type === 'mathml') || hasMathChild) {
      const newHtml = hasMathChild ? el.innerHTML : el.outerHTML;

      if (MathPlugin.mathMlOptions.mmlEditing) {
        const htmlToUse = mmlToLatex(newHtml);
        const latex = htmlDecode(htmlToUse);
        const { unwrapped, wrapType } = unWrapMath(latex);

        return jsx('element', {
          type: 'math',
          data: {
            latex: unwrapped,
            wrapper: wrapType,
          },
        });
      }

      return jsx('element', {
        type: 'mathml',
        data: {
          html: newHtml,
        },
      });
    }

    if (el.nodeType === TEXT_NODE) {
      return;
    }

    if (tagName !== 'span') {
      return;
    }

    const hasLatex = el.hasAttribute('data-latex') || el.hasAttribute('latex');

    if (hasLatex) {
      const latex = htmlDecode(el.innerHTML);
      const { unwrapped, wrapType } = unWrapMath(latex);
      log('[deserialize]: noBrackets: ', unwrapped, wrapType);

      return jsx('element', {
        type: 'math',
        data: {
          latex: unwrapped,
          wrapper: wrapType,
        },
      });
    }
  },
  serialize(object) {
    if (object.type === 'math') {
      const { latex, wrapper } = object.data || {};
      log('[serialize] latex: ', latex);
      const decoded = htmlDecode(lessThanHandling(latex));

      if (MathPlugin.mathMlOptions.mmlOutput) {
        const res = renderMath(`<span data-latex="" data-raw="${decoded}">${wrapMath(decoded, wrapper)}</span>`);
        const newLatex = mmlToLatex(res);

        // we need to remove all the spaces from the latex to be able to compare it
        const strippedL = latex.replace(/\s/g, '');
        const strippedNewL = newLatex.replace(/\s/g, '');

        // we check if the latex keeps his form after being converted to mathml and back to latex
        // if it does we can safely convert it to mathml
        if (isEqual(strippedL, strippedNewL)) {
          return <span data-type="mathml" dangerouslySetInnerHTML={{ __html: res }} />;
        } else {
          // if it doesn't we keep the latex version
          console.log(
            'This latex can not be safely converted to mathml:',
            latex,
            'so we will keep the latex version!!!',
          );
          console.warn(
            'This latex can not be safely converted to mathml:',
            latex,
            'so we will keep the latex version!!!',
          );
        }
      }

      return (
        <span data-latex="" data-raw={decoded}>
          {wrapMath(decoded, wrapper)}
        </span>
      );
    }

    /**
     * Here for rendering mathml content
     */
    if (object.type === 'mathml') {
      const { html } = object.data || {};

      return <span data-type="mathml" dangerouslySetInnerHTML={{ __html: html }} />;
    }
  },
};
