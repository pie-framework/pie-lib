import Functions from '@material-ui/icons/Functions';
import { Inline } from 'slate';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath, unWrapMath, mmlToLatex, renderMath } from '@pie-lib/math-rendering';
import React from 'react';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';
import PropTypes from 'prop-types';

import { BLOCK_TAGS } from '../../serialization';
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
    const { node, value, onFocus, onBlur, onClick } = props;
    const { pluginProps } = props || {};
    const { math } = pluginProps || {};
    const { keypadMode, customKeys, controlledKeypadMode = true } = math || {};

    const onDone = (latex) => {
      const update = {
        ...node.data.toObject(),
        latex,
      };
      const change = value.change().setNodeByKey(node.key, { data: update });

      const nextText = value.document.getNextText(node.key);

      change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);

      props.onToolbarDone(change, false);
    };

    const onChange = (latex) => {
      const update = {
        ...node.data.toObject(),
        latex,
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
      pluginProps: { math: { keypadMode: keypadModeNext, controlledKeypadMode: controlledKeypadModeNext } = {} } = {},
    } = next;
    const keypadModeChanged = keypadMode !== keypadModeNext;
    const controlledKeypadModeChanged = controlledKeypadMode !== controlledKeypadModeNext;

    const equal = node.equals(nodeNext);
    return equal && !keypadModeChanged && !controlledKeypadModeChanged;
  },
);

CustomToolbarComp.propTypes = {
  node: SlatePropTypes.node.isRequired,
  value: SlatePropTypes.value,
  onToolbarDone: PropTypes.func,
  onDataChange: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
};

let mathMlOptions = {};

export default function MathPlugin(opts) {
  mathMlOptions = {
    mmlOutput: opts.mmlOutput,
    mmlEditing: opts.mmlEditing,
  };

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
      supports: (node) => node && node.object === 'inline' && node.type === 'math',
      /**
       * Return a react component function
       * @param node {Slate.Node}
       * @param value {Slate.Value}
       * @param onDone {(change?: Slate.Change, finishEditing :boolea) => void} - a function to call once the toolbar
       *   has made any changes, call with the node.key and a data object.
       */
      CustomToolbarComp,
    },
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
        const html = props.node.data.get('html');

        return <span {...props.attributes} dangerouslySetInnerHTML={{ __html: html }} />;
      }
    },
  };
}

MathPlugin.ROUND_BRACKETS = 'round_brackets';
MathPlugin.SQUARE_BRACKETS = 'square_brackets';
MathPlugin.DOLLAR = 'dollar';
MathPlugin.DOUBLE_DOLLAR = 'double_dollar';

MathPlugin.propTypes = {
  attributes: PropTypes.object,
  node: SlatePropTypes.node,
};

export const inlineMath = () =>
  Inline.create({
    object: 'inline',
    type: 'math',
    isVoid: true,
    data: {
      latex: '',
    },
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
  deserialize(el) {
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
      const htmlToUse = mathMlOptions.mmlEditing ? newHtml : mmlToLatex(newHtml);

      const latex = htmlDecode(htmlToUse);
      const { unwrapped, wrapType } = unWrapMath(latex);

      log('[deserialize]: noBrackets: ', unwrapped, wrapType);

      if (mathMlOptions.mmlEditing) {
        return {
          object: 'inline',
          type: 'math',
          isVoid: true,
          nodes: [],
          data: {
            latex: unwrapped,
            wrapper: wrapType,
          },
        };
      }

      return {
        object: 'inline',
        isVoid: true,
        type: 'mathml',
        data: {
          html: newHtml,
        },
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
          wrapper: wrapType,
        },
      };
    }
  },
  serialize(object) {
    if (object.type === 'math') {
      const l = object.data.get('latex');
      const wrapper = object.data.get('wrapper');
      log('[serialize] latex: ', l);
      const decoded = htmlDecode(lessThanHandling(l));

      if (mathMlOptions.mmlOutput) {
        const res = renderMath(`<span data-latex="" data-raw="${decoded}">${wrapMath(decoded, wrapper)}</span>`);

        return <span data-type="mathml" dangerouslySetInnerHTML={{ __html: res }} />;
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
      const html = object.data.get('html');

      return <span data-type="mathml" dangerouslySetInnerHTML={{ __html: html }} />;
    }
  },
};
