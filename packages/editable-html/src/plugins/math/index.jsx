import Functions from '@material-ui/icons/Functions';
import { Inline } from 'slate';
import MathPreview from './math-preview';
import React from 'react';
import debug from 'debug';
import { MathToolbar } from './math-toolbar';
import { removeBrackets, addBrackets } from '@pie-lib/math-input';
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
      supports: node =>
        node && node.object === 'inline' && node.type === 'math',
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
            const change = value
              .change()
              .setNodeByKey(node.key, { data: update });
            onToolbarDone(change, true);
          };

          const Tb = () => <MathToolbar latex={latex} onDone={onDone} />;
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

export const inlineMath = () =>
  Inline.create({
    object: 'inline',
    type: 'math',
    isVoid: true,
    data: {
      latex: '1 + 1 = 2'
    }
  });

const htmlDecode = input => {
  var doc = new DOMParser().parseFromString(input, 'text/html');
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
      const noBrackets = removeBrackets(latex);
      log('[deserialize]: noBrackets: ', noBrackets);
      return {
        object: 'inline',
        type: 'math',
        isVoid: true,
        nodes: [],
        data: {
          latex: noBrackets
        }
      };
    }
  },
  serialize(object) {
    if (object.type === 'math') {
      const l = object.data.get('latex');
      log('[serialize] latex: ', l);
      const decoded = htmlDecode(l);
      return <span data-latex="">{addBrackets(decoded)}</span>;
    }
  }
};
