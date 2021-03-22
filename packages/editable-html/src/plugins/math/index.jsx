import Functions from '@material-ui/icons/Functions';
import { Inline } from 'slate';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath, unWrapMath } from '@pie-lib/math-rendering';
import React from 'react';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';
import PropTypes from 'prop-types';

import { BLOCK_TAGS } from '../../serialization';
const log = debug('@pie-lib:editable-html:plugins:math');

const TEXT_NODE = 3;

function generateAdditionalKeys(keyData = []) {
  return keyData.map(key => ({
    name: key,
    latex: key,
    write: key,
    label: key
  }));
}

export const CustomToolbarComp = React.memo(
  props => {
    const { node, value, onFocus, onBlur, onClick } = props;
    const { pluginProps } = props || {};
    const { math } = pluginProps || {};
    const { keypadMode, customKeys, controlledKeypadMode = true } = math || {};

    const onDone = latex => {
      const update = {
        ...node.data.toObject(),
        latex
      };
      const change = value.change().setNodeByKey(node.key, { data: update });

      const nextText = value.document.getNextText(node.key);

      change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);

      props.onToolbarDone(change, false);
    };

    const onChange = latex => {
      const update = {
        ...node.data.toObject(),
        latex
      };
      const change = value.change().setNodeByKey(node.key, { data: update });
      log('call onToolbarChange:', change);
      props.onDataChange(node.key, update);
    };

    const latex = node.data.get('latex');

    return (
      <MathToolbar
        autoFocus
        additionalKeys={generateAdditionalKeys(customKeys)}
        latex={latex}
        onChange={onChange}
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
      pluginProps: {
        math: { keypadMode: keypadModeNext, controlledKeypadMode: controlledKeypadModeNext } = {}
      } = {}
    } = next;
    const keypadModeChanged = keypadMode !== keypadModeNext;
    const controlledKeypadModeChanged = controlledKeypadMode !== controlledKeypadModeNext;

    const equal = node.equals(nodeNext);
    return equal && !keypadModeChanged && !controlledKeypadModeChanged;
  }
);

CustomToolbarComp.propTypes = {
  node: SlatePropTypes.node.isRequired,
  value: SlatePropTypes.value,
  onToolbarDone: PropTypes.func,
  onDataChange: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func
};

export default function MathPlugin() {
  return {
    name: 'math',
    toolbar: {
      icon: <Functions />,
      onClick: (value, onChange) => {
        log('[insertMath]');
        const math = inlineMath();
        const change = value.change().insertInline(math);
        onChange(change);
      },
      supports: node => node && node.object === 'inline' && node.type === 'math',
      /**
       * Return a react component function
       * @param node {Slate.Node}
       * @param value {Slate.Value}
       * @param onDone {(change?: Slate.Change, finishEditing :boolea) => void} - a function to call once the toolbar
       *   has made any changes, call with the node.key and a data object.
       */
      CustomToolbarComp
    },
    schema: {
      document: { match: [{ type: 'math' }] }
    },

    pluginStyles: (node, parentNode, p) => {
      if (p) {
        return {
          position: 'absolute',
          top: 'initial'
        };
      }
    },

    renderNode: props => {
      if (props.node.type === 'math') {
        log('[renderNode]: data:', props.node.data);
        return <MathPreview {...props} />;
      }

      /**
       * Here for rendering mathml content
       */
      if (props.node.type === 'mathml') {
        const html = props.node.data.get('html');

        return <span {...props.attributes} dangerouslySetInnerHTML={{ __html: html }} />;
      }
    },

    normalizeNode: node => {
      if (node.object !== 'document') {
        return;
      }

      const addSpacesArray = [];

      const allElements = node.filterDescendants(d => d.type === 'math');

      allElements.forEach(el => {
        const prevText = node.getPreviousText(el.key);
        const lastCharIsNewLine = prevText.text[prevText.text.length - 1] === '\n';

        if (prevText.text.length === 0 || lastCharIsNewLine) {
          addSpacesArray.push({
            nr: lastCharIsNewLine ? 1 : 2,
            key: prevText.key
          });
        }
      });

      if (!addSpacesArray.length) {
        return;
      }

      return change => {
        change.withoutNormalization(() => {
          addSpacesArray.forEach(({ key, nr }) => {
            const node = change.value.document.getNode(key);

            change.insertTextByKey(key, node.text.length, '\u00A0'.repeat(nr));
          });
        });
      };
    }
  };
}

MathPlugin.ROUND_BRACKETS = 'round_brackets';
MathPlugin.SQUARE_BRACKETS = 'square_brackets';
MathPlugin.DOLLAR = 'dollar';
MathPlugin.DOUBLE_DOLLAR = 'double_dollar';

export const inlineMath = () =>
  Inline.create({
    object: 'inline',
    type: 'math',
    isVoid: true,
    data: {
      latex: ''
    }
  });

const htmlDecode = input => {
  const doc = new DOMParser().parseFromString(input, 'text/html');

  return doc.documentElement.textContent;
};

const getTagName = el => {
  return ((el && el.tagName) || '').toLowerCase();
};

export const serialization = {
  deserialize(el) {
    const tagName = getTagName(el);
    /**
     * This is used for when there's a wrapper over the mathml element.
     * Because of this slate rule: "Only allow block nodes or inline and text nodes in blocks."
     * The element that contains only the mathml is removed (along with the math) because it has
     * an inline child and the block is of type block
     * This is for legacy content only since our math rendering is valid for the core slate rules
     */
    const hasMathChild =
      BLOCK_TAGS[tagName] && el.childNodes.length === 1 && getTagName(el.firstChild) === 'math';
    log('[deserialize] name: ', tagName);

    /**
     * This is here in order to be able to render mathml content
     */
    if (tagName === 'math' || (el.dataset && el.dataset.type === 'mathml') || hasMathChild) {
      const newHtml = hasMathChild ? el.innerHTML : el.outerHTML;

      return {
        object: 'inline',
        isVoid: true,
        type: 'mathml',
        data: {
          html: newHtml
        }
      };
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
      return {
        object: 'inline',
        type: 'math',
        isVoid: true,
        nodes: [],
        data: {
          latex: unwrapped,
          wrapper: wrapType
        }
      };
    }
  },
  serialize(object) {
    if (object.type === 'math') {
      const l = object.data.get('latex');
      const wrapper = object.data.get('wrapper');
      log('[serialize] latex: ', l);
      const decoded = htmlDecode(l);
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
      const html = object.data.get('html');

      return <span data-type="mathml" dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }
};
