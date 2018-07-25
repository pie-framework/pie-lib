import Functions from '@material-ui/icons/Functions';
import { Inline } from 'slate';
import MathPreview from './math-preview';
import React from 'react';
import debug from 'debug';
import { MathToolbar } from './math-toolbar';

const log = debug('editable-html:plugins:math');

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
       * @param toolbarDone {Function} a function to call once the toolbar has made any changes, call with the node.key and a data object.
       */
      customToolbar: (node, toolbarDone) => {
        if (node && node.object === 'inline' && node.type === 'math') {
          const latex = node.data.get('latex');
          const onDone = latex => {
            const update = {
              ...node.data.toObject(),
              latex
            };
            toolbarDone(node.key, update);
          };

          const Tb = () => <MathToolbar latex={latex} onDone={onDone} />;
          return Tb;
        }
      },

      /**
       * This method takes the output of customToolbars onDone method + a Slate.Value object.
       * @returns {Slate.Change} a change object
       */
      applyChange: (nodeKey, nodeData, value) =>
        value.change().setNodeByKey(nodeKey, { data: nodeData })
    },
    schema: {
      document: { types: ['math'] }
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

export const serialization = {
  deserialize(el) {
    if (el.nodeType === TEXT_NODE) {
      return;
    }

    const tagName = el.tagName.toLowerCase();
    log('[deserialize] name: ', tagName);
    const hasMathJaxAttribute =
      el.getAttribute('mathjax') !== undefined ||
      el.getAttribute('data-mathjax') !== undefined;

    log('[deserialize] hasMathJaxAttribute: ', hasMathJaxAttribute);
    if (tagName === 'span' && hasMathJaxAttribute) {
      return {
        object: 'inline',
        type: 'math',
        isVoid: true,
        nodes: [],
        data: {
          latex: el.innerHTML
        }
      };
    }
  },
  serialize(object) {
    if (object.type === 'math') {
      return <span data-mathjax="">{object.data.get('latex')}</span>;
    }
  }
};
