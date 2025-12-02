import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import styles from '../styles/editorContainerStyles';
import { valueToSize } from '../utils/size';

import StyledMenuBar from './MenuBar';

function TiptapContainer(props) {
  const {
    editor,
    editorState,
    classes,
    children,
    disableUnderline,
    disableScrollbar,
    activePlugins,
    toolbarOpts,
    responseAreaProps,
    autoFocus,
    minWidth,
    width,
    maxWidth,
    minHeight,
    height,
    maxHeight,
  } = props;

  const holderNames = classNames(classes.editorHolder, {
    [classes.editorInFocus]: editorState.isFocused,
    [classes.readOnly]: editorState.readOnly,
    [classes.disabledUnderline]: disableUnderline,
    [classes.disabledScrollbar]: disableScrollbar,
  });

  useEffect(() => {
    if (editor && autoFocus) {
      Promise.resolve().then(() => {
        editor.commands.focus('end');
      });
    }
  }, [editor, autoFocus]);

  const sizeStyle = useMemo(
    () => ({
      width: valueToSize(width),
      minWidth: valueToSize(minWidth),
      maxWidth: valueToSize(maxWidth),
      height: valueToSize(height),
      minHeight: valueToSize(minHeight),
      maxHeight: valueToSize(maxHeight),
    }),
    [minWidth, width, maxWidth, minHeight, height, maxHeight],
  );

  return (
    <div
      className={classNames(
        {
          [classes.noBorder]: toolbarOpts && toolbarOpts.noBorder,
          [classes.error]: toolbarOpts && toolbarOpts.error,
        },
        classes.root,
        props.className,
      )}
      style={{ width: sizeStyle.width, minWidth: sizeStyle.minWidth, maxWidth: sizeStyle.maxWidth }}
    >
      <div className={holderNames}>
        <div
          className={classNames(
            {
              [classes.noPadding]: toolbarOpts && toolbarOpts.noPadding,
            },
            classes.children,
          )}
        >
          {children}
        </div>
      </div>

      {editor && (
        <StyledMenuBar
          editor={editor}
          responseAreaProps={responseAreaProps}
          toolbarOpts={toolbarOpts}
          activePlugins={activePlugins}
          onChange={props.onChange}
        />
      )}
    </div>
  );
}

const EditorContainer = withStyles(styles)(TiptapContainer);

export default EditorContainer;
