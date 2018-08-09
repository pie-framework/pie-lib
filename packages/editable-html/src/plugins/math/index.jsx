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
      latex: '1 + 1 = 2'
    }
  });

const htmlDecode = input => {
  var doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
};

const PAIRS = {
  [MathPlugin.ROUND_BRACKETS]: ['\\(', '\\)'],
  [MathPlugin.SQUARE_BRACKETS]: ['\\[', '\\]'],
  [MathPlugin.DOLLAR]: ['$', '$'],
  [MathPlugin.DOUBLE_DOLLAR]: ['$$', '$$']
};

export const wrap = (content, wrapType) => {
  if (wrapType === MathPlugin.SQUARE_BRACKETS) {
    console.warn('\\[...\\] is not supported yet'); // eslint-disable-line
    wrapType = MathPlugin.ROUND_BRACKETS;
  }
  if (wrapType === MathPlugin.DOUBLE_DOLLAR) {
    console.warn('$$...$$ is not supported yet'); // eslint-disable-line
    wrapType = MathPlugin.DOLLAR;
  }

  const [start, end] = PAIRS[wrapType] || PAIRS[MathPlugin.ROUND_BRACKETS];
  return `${start}${content}${end}`;
};

export const unwrap = content => {
  if (content.startsWith('$$') && content.endsWith('$$')) {
    console.warn('$$ syntax is not yet supported'); // eslint-disable-line
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: MathPlugin.DOLLAR
    };
  }
  if (content.startsWith('$') && content.endsWith('$')) {
    return {
      unwrapped: content.substring(1, content.length - 1),
      wrapType: MathPlugin.DOLLAR
    };
  }

  if (content.startsWith('\\[') && content.endsWith('\\]')) {
    console.warn('\\[..\\] syntax is not yet supported'); // eslint-disable-line
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: MathPlugin.ROUND_BRACKETS
    };
  }

  if (content.startsWith('\\(') && content.endsWith('\\)')) {
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: MathPlugin.ROUND_BRACKETS
    };
  }

  return {
    unwrapped: content,
    wrapType: MathPlugin.ROUND_BRACKETS
  };
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
      const { unwrapped, wrapType } = unwrap(latex);
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
      return <span data-latex="">{wrap(decoded, wrapper)}</span>;
    }
  }
};
