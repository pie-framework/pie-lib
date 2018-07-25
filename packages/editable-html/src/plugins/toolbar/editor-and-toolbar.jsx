import React from 'react';
import Toolbar from './toolbar';
import classNames from 'classnames';
import debug from 'debug';
import { primary } from '../../theme';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SlatePropTypes from 'slate-prop-types';

const log = debug('editable-html:plugins:toolbar:editor-and-toolbar');

export class EditorAndToolbar extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    value: SlatePropTypes.value.isRequired,
    plugins: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    focusedNode: SlatePropTypes.node,
    readOnly: PropTypes.bool,
    classes: PropTypes.object.isRequired
  };

  render() {
    const {
      classes,
      children,
      value,
      plugins,
      onChange,
      onDone,
      focusedNode,
      readOnly
    } = this.props;

    const inFocus =
      value.isFocused || (focusedNode !== null && focusedNode !== undefined);
    const holderNames = classNames(
      classes.editorHolder,
      inFocus && classes.editorInFocus,
      readOnly && classes.readOnly
    );

    log(
      '[render] inFocus: ',
      inFocus,
      'value.isFocused:',
      value.isFocused,
      'focused node: ',
      focusedNode
    );

    return (
      <div className={classes.root}>
        <div className={holderNames}>
          <div className={classes.children}>{children}</div>
        </div>
        <Toolbar
          plugins={plugins}
          focusedNode={focusedNode}
          value={value}
          isFocused={inFocus}
          onChange={onChange}
          onDone={onDone}
        />
      </div>
    );
  }
}

const style = {
  root: {
    height: '100%',
    position: 'relative',
    padding: '0px',
    border: 'none',
    borderBottom: '0px solid #cccccc',
    borderRadius: '0px',
    cursor: 'text',
    '& [data-slate-editor="true"]': {
      overflow: 'auto',
      maxHeight: '500px'
    }
  },
  children: {
    padding: '7px',
    height: '100%'
  },
  editorHolder: {
    position: 'relative',
    height: '100%',
    padding: '0px',
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
      transition:
        'transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms, background-color 200ms linear',
      backgroundColor: 'rgba(0, 0, 0, 0.42)'
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
    }
  },

  readOnly: {
    '&::before': {
      background: 'transparent',
      backgroundSize: '5px 1px',
      backgroundImage:
        'linear-gradient(to right, rgba(0, 0, 0, 0.42) 33%, transparent 0%)',
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'left top'
    },
    '&::after': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition:
        'transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms, background-color 0ms linear',
      backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    '&:hover': {
      '&::after': {
        transform: 'scaleX(0)',
        backgroundColor: 'black',
        height: '2px'
      }
    }
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
};

export default withStyles(style)(EditorAndToolbar);
