import React, { useState, useRef, useEffect } from 'react';
import { useSlate } from 'slate-react';
import PropTypes from 'prop-types';
import Editor, { DEFAULT_PLUGINS, ALL_PLUGINS } from './editor';
import { htmlToValue, valueToHtml } from './new-serialization';
import { parseDegrees } from './parse-html';
import debug from 'debug';
import { Range } from 'slate';

const log = debug('@pie-lib:editable-html');
/**
 * Export lower level Editor and serialization functions.
 */
export { htmlToValue, valueToHtml, Editor, DEFAULT_PLUGINS, ALL_PLUGINS };

const useConstructor = (callback = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);

  if (hasBeenCalled) {
    return;
  }

  callback();
  setHasBeenCalled(true);
};

const EditableHtml = React.forwardRef((props, forwardedRef) => {
  const editorRef = useRef(null);
  const rootRef = useRef(null);
  const [value, setValue] = useState();

  useConstructor(() => {
    const v = htmlToValue(props.markup);
    setValue(v);
  });

  const onChange = (value, done) => {
    const html = valueToHtml(value);
    const htmlParsed = parseDegrees(html);

    log('value as html: ', html);

    if (html !== props.markup) {
      props.onChange(htmlParsed);
    }

    if (done) {
      props.onDone(htmlParsed);
    }
  };

  const focus = (position, node, select = false) => {
    if (this.editorRef) {
      this.editorRef.change((c) => {
        const lastText = node ? c.value.document.getNextText(node.key) : c.value.document.getLastText();
        const editorDOM = document.querySelector(`[data-key="${this.editorRef.value.document.key}"]`);

        if (editorDOM !== document.activeElement) {
          document.activeElement.blur();
        }

        c.focus();

        if (position === 'end' && lastText) {
          c.moveFocusTo(lastText.key, lastText.text?.length).moveAnchorTo(lastText.key, lastText.text?.length);
          if (select) {
            const range = Range.fromJSON({
              anchorKey: lastText.key,
              anchorOffset: 0,
              focusKey: lastText.key,
              focusOffset: lastText.text?.length,
              isFocused: true,
              isBackward: false,
            });
            c.select(range);
          }
        }

        if (position === 'beginning' && lastText) {
          c.moveFocusTo(lastText.key, 0).moveAnchorTo(lastText.key, 0);
        }
        editorDOM.focus();
      });
    }
  };

  const { toolbarOpts, error } = props;

  if (toolbarOpts) {
    toolbarOpts.error = error;
  }

  const newProps = {
    ...props,
    markup: null,
    value,
    onChange,
    focus,
  };

  return (
    <Editor
      {...newProps}
      onRef={(ref) => {
        if (ref) {
          rootRef.current = ref;

          if (forwardedRef) {
            forwardedRef(ref);
          }
        }
      }}
      editorRef={(ref) => ref && (editorRef.current = ref)}
    />
  );
});

EditableHtml.propTypes = {
  onChange: PropTypes.func.isRequired,
  onDone: PropTypes.func,
  onEditor: PropTypes.func,
  markup: PropTypes.string.isRequired,
  allowValidation: PropTypes.bool,
};

EditableHtml.defaultProps = {
  onDone: () => {},
  allowValidation: false,
};

export default EditableHtml;
