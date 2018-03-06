import { findSingleNode, selectedNode } from './utils';

import React from 'react';
import Toolbar from './toolbar';
import classNames from 'classnames';
import debug from 'debug';
import injectSheet from 'react-jss';
import { primary } from '../../theme';

const log = debug('editable-html:plugins:toolbar:editor-and-toolbar');

export class RawEditorAndToolbar extends React.Component {

  render() {

    const {
     classes,
      children,
      value,
      plugins,
      onChange,
      onDone,
      focusedNode
   } = this.props;


    const inFocus = value.isFocused || (focusedNode !== null && focusedNode !== undefined);
    const holderNames = classNames(classes.editorHolder, inFocus && classes.editorInFocus);

    log('[render] inFocus: ', inFocus, 'value.isFocused:', value.isFocused, 'focused node: ', focusedNode);

    return (
      <div className={classes.root}>
        <div className={holderNames}>{children}</div>
        <Toolbar
          plugins={plugins}
          value={value}
          isFocused={inFocus}
          onChange={onChange}
          onDone={onDone} />
      </div>
    );
  }
}

const style = {
  root: {
    position: 'relative',
    padding: '0px',
    border: 'none',
    borderBottom: '0px solid #cccccc',
    borderRadius: '0px',
    cursor: 'text',
    '& [data-slate-editor="true"]': {
      overflow: 'auto',
      maxHeight: '500px',
    }
  },
  editorHolder: {
    position: 'relative',
    padding: '7px',
    '&::before': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.42)'
    },
    '&::after': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition: `transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms, background-color 200ms linear`,
      backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    '&:focus': {
      '&::after': {
        transform: 'scaleX(1)',
        backgroundColor: primary,
        height: '2px'
      }
    },
    '&:hover': {
      '&::after': {
        transform: 'scaleX(1)',
        backgroundColor: 'black',
        height: '2px'
      }
    },
  },
  editorInFocus: {
    '&::after': {
      transform: 'scaleX(1)',
      backgroundColor: primary,
      height: '2px'
    },
    '&:hover': {
      '&::after': {
        backgroundColor: primary
      }
    }
  }
}

export default injectSheet(style)(RawEditorAndToolbar);
