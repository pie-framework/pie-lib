import Functions from '@material-ui/icons/Functions';
import { Inline } from 'slate';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath, unWrapMath } from '@pie-lib/math-rendering';
import React from 'react';
import debug from 'debug';

const log = debug('@pie-lib:editable-html:plugins:math');

const TEXT_NODE = 3;

export default function MathPlugin(/*options*/) {
  return {
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
       * @param onDone {(change?: Slate.Change, finishEditing :boolea) => void} - a function to call once the toolbar has made any changes, call with the node.key and a data object.
       */
      customToolbar: (node, value, onToolbarDone) => {
        if (node && node.object === 'inline' && node.type === 'math') {
          const latex = node.data.get('latex');
          const onDone = latex => {
            const update = {
              ...node.data.toObject(),
              latex
            };
            const change = value.change().setNodeByKey(node.key, { data: update });
            onToolbarDone(change, true);
          };

          const Tb = () => <MathToolbar autoFocus latex={latex} onDone={onDone} />;
          return Tb;
        }
      }
    },
    schema: {
      document: { match: [{ type: 'math' }] }
    },

    renderNode: props => {
      if (props.node.type === 'math') {
        log('[renderNode]: data:', props.node.data);
        return <MathPreview {...props} />;
      }
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

export const serialization = {
  deserialize(el) {
    if (el.nodeType === TEXT_NODE) {
      return;
    }

    const tagName = el.tagName.toLowerCase();
    log('[deserialize] name: ', tagName);

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
  }
};
