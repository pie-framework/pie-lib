import React from 'react';
import Toolbar from './toolbar';
import classNames from 'classnames';
import debug from 'debug';
import { primary } from '../../theme';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SlatePropTypes from 'slate-prop-types';
import { color } from '../../../render-ui';

const log = debug('@pie-lib:editable-html:plugins:toolbar:editor-and-toolbar');

export class EditorAndToolbar extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    value: SlatePropTypes.value.isRequired,
    plugins: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    getFocusedValue: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    onDataChange: PropTypes.func,
    toolbarRef: PropTypes.func,
    focusedNode: SlatePropTypes.node,
    readOnly: PropTypes.bool,
    disableScrollbar: PropTypes.bool,
    disableUnderline: PropTypes.bool,
    autoWidth: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    pluginProps: PropTypes.object,
    toolbarOpts: PropTypes.shape({
      position: PropTypes.oneOf(['bottom', 'top']),
      alwaysVisible: PropTypes.bool,
      error: PropTypes.string,
      noBorder: PropTypes.any,
      noPadding: PropTypes.any,
    }),
    focusToolbar: PropTypes.bool.isRequired,
    onToolbarFocus: PropTypes.func.isRequired,
    onToolbarBlur: PropTypes.func.isRequired,
    doneButtonRef: PropTypes.func,
  };

  render() {
    const {
      classes,
      children,
      value,
      plugins,
      onChange,
      getFocusedValue,
      onDone,
      focusedNode,
      autoWidth,
      readOnly,
      disableScrollbar,
      disableUnderline,
      pluginProps,
      toolbarOpts,
      onDataChange,
      toolbarRef,
      doneButtonRef,
      focusToolbar,
      onToolbarFocus,
      onToolbarBlur,
    } = this.props;

    let inFocus = value.isFocused || (focusedNode !== null && focusedNode !== undefined) || focusToolbar;

    const holderNames = classNames(classes.editorHolder, {
      [classes.editorInFocus]: inFocus,
      [classes.readOnly]: readOnly,
      [classes.disabledUnderline]: disableUnderline,
      [classes.disabledScrollbar]: disableScrollbar,
    });

    let clonedChildren = children;

    if (typeof children !== 'string') {
      clonedChildren = React.cloneElement(children, {
        ref: (el) => (this.editorRef = el),
      });
    }

    log('[render] inFocus: ', inFocus, 'value.isFocused:', value.isFocused, 'focused node: ', focusedNode);

    return (
      <div
        className={classNames(
          {
            [classes.noBorder]: toolbarOpts && toolbarOpts.noBorder,
            [classes.error]: toolbarOpts && toolbarOpts.error,
          },
          classes.root,
        )}
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
            {clonedChildren}
          </div>
        </div>

        <Toolbar
          autoWidth={autoWidth}
          plugins={plugins}
          focusedNode={focusedNode}
          value={value}
          isFocused={inFocus}
          onBlur={onToolbarBlur}
          onFocus={onToolbarFocus}
          onChange={onChange}
          getFocusedValue={getFocusedValue}
          onDone={onDone}
          onDataChange={onDataChange}
          toolbarRef={toolbarRef}
          doneButtonRef={doneButtonRef}
          pluginProps={pluginProps}
          toolbarOpts={toolbarOpts}
        />
      </div>
    );
  }
}

const style = (theme) => ({
  root: {
    position: 'relative',
    padding: '0px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'text',
    '& [data-slate-editor="true"]': {
      wordBreak: 'break-word',
      overflow: 'visible',
      maxHeight: '500px',
      // needed in order to be able to put the focus before a void element when it is the first one in the editor
      padding: '5px',
    },
  },
  children: {
    padding: '10px 16px',
  },
  editorHolder: {
    position: 'relative',
    padding: '0px',
    overflowY: 'auto',
    color: color.text(),
    backgroundColor: color.background(),
    '&::before': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      pointerEvents: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    '&::after': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition: 'transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms, background-color 200ms linear',
      backgroundColor: 'rgba(0, 0, 0, 0.42)',
    },
    '&:focus': {
      '&::after': {
        transform: 'scaleX(1)',
        backgroundColor: primary,
        height: '2px',
      },
    },
    '&:hover': {
      '&::after': {
        transform: 'scaleX(1)',
        backgroundColor: theme.palette.common.black,
        height: '2px',
      },
    },
  },
  disabledUnderline: {
    '&::before': {
      display: 'none',
    },
    '&::after': {
      display: 'none',
    },
  },
  disabledScrollbar: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
  },
  readOnly: {
    '&::before': {
      background: 'transparent',
      backgroundSize: '5px 1px',
      backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.42) 33%, transparent 0%)',
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'left top',
    },
    '&::after': {
      left: '0',
      right: '0',
      bottom: '0',
      height: '1px',
      content: '""',
      position: 'absolute',
      transform: 'scaleX(0)',
      transition: 'transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms, background-color 0ms linear',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    '&:hover': {
      '&::after': {
        transform: 'scaleX(0)',
        backgroundColor: theme.palette.common.black,
        height: '2px',
      },
    },
  },
  editorInFocus: {
    '&::after': {
      transform: 'scaleX(1)',
      backgroundColor: primary,
      height: '2px',
    },
    '&:hover': {
      '&::after': {
        backgroundColor: primary,
      },
    },
  },
  error: {
    border: `2px solid ${theme.palette.error.main} !important`,
  },
  noBorder: {
    border: 'none',
  },
  noPadding: {
    padding: 0,
  },
});

export default withStyles(style)(EditorAndToolbar);
