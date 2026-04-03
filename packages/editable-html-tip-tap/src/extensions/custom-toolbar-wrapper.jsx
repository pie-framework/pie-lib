import React from 'react';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import { PIE_TOOLBAR__CLASS } from '../constants';
import { styled } from '@mui/material/styles';
import { DoneButton } from '../components/common/done-button';

const StyledToolbar = styled('div', {
  shouldForwardProp: (prop) => !['showDone', 'toolbarAlignment', 'isFocused', 'autoWidth', 'isHidden'].includes(prop),
})(({ showDone, toolbarAlignment, isFocused, autoWidth, isHidden }) => ({
  position: 'absolute',
  zIndex: 10,
  cursor: 'pointer',
  justifyContent: 'space-between',
  background: 'var(--editable-html-toolbar-bg, #efefef)',
  minWidth: showDone ? '280px' : '265px',
  margin: '5px 0 0 0',
  padding: '2px',
  boxShadow:
    '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  boxSizing: 'border-box',
  display: 'flex',
  opacity: 1,
  ...(toolbarAlignment === 'right' && {
    right: 0,
  }),
  ...(autoWidth
    ? {
        width: 'auto',
      }
    : {
        width: '100%',
      }),
  ...(isHidden && {
    visibility: 'hidden',
  }),
}));

const StyledIconButton = styled(IconButton)({
  width: '28px',
  height: '28px',
  padding: '4px',
  verticalAlign: 'top',
});

const SharedContainer = styled('div')({
  display: 'flex',
});

function CustomToolbarWrapper(props) {
  const { children, deletable, toolbarOpts, autoWidth, isFocused, doneButtonRef, onDelete, showDone, onDone, style } = props;
  const customStyles = toolbarOpts.minWidth !== undefined ? { minWidth: toolbarOpts.minWidth } : {};

  return (
    <StyledToolbar
      className={PIE_TOOLBAR__CLASS}
      showDone={showDone}
      toolbarAlignment={toolbarOpts.alignment}
      isFocused={toolbarOpts.alwaysVisible || isFocused}
      autoWidth={autoWidth}
      isHidden={toolbarOpts.isHidden === true}
      style={{ ...customStyles, ...style }}
    >
      {children}

      <SharedContainer>
        {deletable && (
          <StyledIconButton aria-label="Delete" onMouseDown={(e) => onDelete?.(e)}>
            <Delete />
          </StyledIconButton>
        )}
        {showDone && <DoneButton doneButtonRef={doneButtonRef} onClick={onDone} />}
      </SharedContainer>
    </StyledToolbar>
  );
}

export default CustomToolbarWrapper;
