import Functions from '@material-ui/icons/Functions';
import { Inline } from 'slate';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath, unWrapMath } from '@pie-lib/math-rendering';
import React from 'react';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';
import PropTypes from 'prop-types';
const log = debug('@pie-lib:editable-html:plugins:math');

const TEXT_NODE = 3;

export const CustomToolbarComp = React.memo(
  props => {
    const { node, value, onFocus, onBlur, onClick } = props;

    // console.log('new options:', onFocus, onBlur, onClick);
    const onDone = (latex, b) => {
      console.log('onDone !!! ', latex, b);
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
      // setTimejout(() => {
      props.onDataChange(node.key, update);
      // }, 1000);
    };

    // console.log('node...', node);
    const latex = node.data.get('latex');

    console.log('[NewCustomToolbar] RENDER ------------------------>', latex);
    return (
      <MathToolbar
        autoFocus
        latex={latex}
        onChange={onChange}
        onDone={onDone}
        onBlur={onBlur}
        onFocus={onFocus}
        // e => {
        //   // console.log('!!!!!onFocus!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //   onFocus(e, node);
        // }}
        onClick={onClick}
        // e => {
        //   console.log('click !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //   onClick(e);
        // }}
      />
    );
  },
  (prev, next) => {
    const equal = prev.node.equals(next.node);
    console.log('should re-render - ?????? equal: ', equal, 'skip if true');
    return equal;
  }
);

CustomToolbarComp.propTypes = {
  node: SlatePropTypes.node.isRequired,
  value: SlatePropTypes.value,
  onToolbarDone: PropTypes.func,
  onDataChange: PropTypes.func
};

export default function MathPlugin(opts) {
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
      // customToolbar: (node, value, onToolbarDone, onToolbarDataChange) => {
      //   if (node && node.object === 'inline' && node.type === 'math') {
      //     const latex = node.data.get('latex');
      //     const onDone = latex => {
      //       const update = {
      //         ...node.data.toObject(),
      //         latex
      //       };
      //       const change = value.change().setNodeByKey(node.key, { data: update });

      //       const nextText = value.document.getNextText(node.key);

      //       change.moveFocusTo(nextText.key, 0).moveAnchorTo(nextText.key, 0);

      //       onToolbarDone(change, false);
      //     };

      //     const onDataChange = latex => {
      //       if (node.data.get('latex') !== latex) {
      //         const update = { ...node.data.toObject(), latex };
      //         onToolbarDataChange(node.key, update);
      //       }
      //     };

      //     const Tb = props => {
      //       const { pluginProps } = props || {};
      //       const { math } = pluginProps || {};
      //       const { keypadMode } = math || {};

      //       return (
      //         <MathToolbar
      //           autoFocus
      //           latex={latex}
      //           onBlur={opts.onBlur}
      //           onDone={onDone}
      //           onChange={onDataChange}
      //           keypadMode={keypadMode}
      //         />
      //       );
      //     };

      //     return Tb;
      //   }
      // }
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

      if (props.node.type === 'mathml') {
        const html = props.node.data.get('html');

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: html
            }}
          />
        );
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
    const tagName = el.tagName.toLowerCase();
    log('[deserialize] name: ', tagName);

    if (tagName === 'math') {
      return {
        object: 'block',
        isVoid: true,
        type: 'mathml',
        data: {
          html: el.outerHTML
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

    if (object.type === 'mathml') {
      const html = object.data.get('html');

      return (
        <span
          contentEditable={false}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
  }
};
