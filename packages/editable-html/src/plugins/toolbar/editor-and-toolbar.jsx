import React from 'react';
import Toolbar from './toolbar';
import classNames from 'classnames';
import debug from 'debug';
import { primary } from '../../theme';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import SlatePropTypes from 'slate-prop-types';
import { color } from '@pie-lib/render-ui';

const log = debug('@pie-lib:editable-html:plugins:toolbar:editor-and-toolbar');

const Root = styled('div', {
  shouldForwardProp: (prop) => !['noBorder', 'error'].includes(prop),
})(({ theme, noBorder, error }) => ({
  position: 'relative',
  padding: '0px',
  border: noBorder ? 'none' : '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'text',
  borderColor: error ? `${theme.palette.error.main} !important` : undefined,
  borderWidth: error ? '2px !important' : undefined,
  '& [data-slate-editor="true"]': {
    wordBreak: 'break-word',
    overflow: 'visible',
    maxHeight: '500px',
    // needed in order to be able to put the focus before a void element when it is the first one in the editor
    padding: '5px',
  },
}));

const EditorHolder = styled('div', {
  shouldForwardProp: (prop) => !['inFocus', 'readOnly', 'disableUnderline', 'disableScrollbar'].includes(prop),
})(({ theme, inFocus, readOnly, disableUnderline, disableScrollbar }) => ({
  position: 'relative',
  padding: '0px',
  overflowY: 'auto',
  color: color.text(),
  backgroundColor: color.background(),
  ...(disableScrollbar && {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
  }),
  ...(!disableUnderline && {
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
  }),
  ...(readOnly && {
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
  }),
  ...(inFocus && {
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
  }),
}));

const ChildrenContainer = styled('div', {
  shouldForwardProp: (prop) => !['noPadding'].includes(prop),
})(({ noPadding }) => ({
  padding: noPadding ? 0 : '10px 16px',
}));

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

    let clonedChildren = children;

    if (typeof children !== 'string') {
      clonedChildren = React.cloneElement(children, {
        ref: (el) => (this.editorRef = el),
      });
    }

    log('[render] inFocus: ', inFocus, 'value.isFocused:', value.isFocused, 'focused node: ', focusedNode);

    return (
      <Root
        noBorder={toolbarOpts && toolbarOpts.noBorder}
        error={toolbarOpts && toolbarOpts.error}
      >
        <EditorHolder
          inFocus={inFocus}
          readOnly={readOnly}
          disableUnderline={disableUnderline}
          disableScrollbar={disableScrollbar}
        >
          <ChildrenContainer noPadding={toolbarOpts && toolbarOpts.noPadding}>
            {clonedChildren}
          </ChildrenContainer>
        </EditorHolder>

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
      </Root>
    );
  }
}

export default EditorAndToolbar;
