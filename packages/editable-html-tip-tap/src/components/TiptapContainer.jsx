import React, { useEffect, useMemo, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';
import { valueToSize } from '../utils/size';

import StyledMenuBar from './MenuBar';

// Background color for highlighted editor (e.g., when highlightShape is true in student view)
// This is the same color used in the previous Slate implementation
const HIGHLIGHT_BACKGROUND_COLOR = 'rgba(0,0,0,0.06)';

const StyledRoot = styled('div', {
  shouldForwardProp: (prop) => !['noBorder', 'error'].includes(prop),
})(({ theme, noBorder, error }) => ({
  position: 'relative',
  padding: '0px',
  border: noBorder ? 'none' : '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'text',
  '& [data-slate-editor="true"]': {
    wordBreak: 'break-word',
    overflow: 'visible',
    maxHeight: '500px',
    padding: '5px',
  },
  '&:first-child': {
    marginTop: 0,
  },
  '& ul, & ol': {
    padding: '0 1rem',
    margin: '1.25rem 1rem 1.25rem 0.4rem',
  },
  '& ul li p, & ol li p': {
    marginTop: '0.25em',
    marginBottom: '0.25em',
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    lineHeight: 1.1,
    marginTop: '2.5rem',
    textWrap: 'pretty',
  },
  '& h1, & h2': {
    marginTop: '3.5rem',
    marginBottom: '1.5rem',
  },
  '& h1': {
    fontSize: '1.4rem',
  },
  '& h2': {
    fontSize: '1.2rem',
  },
  '& h3': {
    fontSize: '1.1rem',
  },
  '& h4, & h5, & h6': {
    fontSize: '1rem',
  },
  '& code': {
    backgroundColor: 'var(--purple-light)',
    borderRadius: '0.4rem',
    color: 'var(--black)',
    fontSize: '0.85rem',
    padding: '0.25em 0.3em',
  },
  '& pre': {
    background: 'var(--black)',
    borderRadius: '0.5rem',
    color: 'var(--white)',
    fontFamily: '\'JetBrainsMono\', monospace',
    margin: '1.5rem 0',
    padding: '0.75rem 1rem',
    '& code': {
      background: 'none',
      color: 'inherit',
      fontSize: '0.8rem',
      padding: 0,
    },
  },
  '& blockquote': {
    borderLeft: '3px solid var(--gray-3)',
    margin: '1.5rem 0',
    paddingLeft: '1rem',
  },
  '& hr': {
    border: 'none',
    borderTop: '1px solid var(--gray-2)',
    margin: '2rem 0',
  },
  '& p': {
    margin: '0',
  },
  '& table': {
    tableLayout: 'fixed',
    width: '100%',
    borderCollapse: 'collapse',
    color: color.text(),
    backgroundColor: color.background(),
  },
  '& table:not([border="1"]) tr': {
    borderTop: '1px solid #dfe2e5',
  },
  '& td, th': {
    padding: '.6em 1em',
    textAlign: 'center',
  },
  '& table:not([border="1"]) td, th': {
    border: '1px solid #dfe2e5',
  },
  ...(error && {
    border: `2px solid ${theme.palette.error.main} !important`,
  }),
}));

const StyledEditorHolder = styled('div', {
  shouldForwardProp: (prop) => !['disableScrollbar', 'bgColor'].includes(prop),
})(({ disableScrollbar, bgColor }) => ({
  position: 'relative',
  padding: '0px',
  overflowY: 'auto',
  color: color.text(),
  backgroundColor: bgColor || color.background(),
  ...(disableScrollbar && {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
  }),
}));

const StyledChildren = styled('div', {
  shouldForwardProp: (prop) => prop !== 'noPadding',
})(({ noPadding }) => ({
  padding: noPadding ? 0 : '10px 8px',
}));

function TiptapContainer(props) {
  const [adjustedWidth, setAdjustedWidth] = useState(null);
  const rootRef = useRef(null);
  const {
    editor,
    disabled,
    children,
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
    highlightShape,
    ref,
  } = props;

  useEffect(() => {
    if (editor && autoFocus) {
      Promise.resolve().then(() => {
        editor.commands.focus('end');
      });
    }
  }, [editor, autoFocus]);

  useEffect(() => {
    if (props.adjustWidthForLimit) {
      const el = document.createElement('p');

      el.style.visibility = 'hidden';
      el.style.position = 'absolute';
      el.textContent = 'W'.repeat(props.charactersLimit);

      rootRef.current.appendChild(el);

      setAdjustedWidth(`${el.offsetWidth + 27}px`);

      el.remove();
    }
  }, [props.adjustWidthForLimit, props.charactersLimit]);

  const sizeStyle = useMemo(
    () => ({
      width: valueToSize(adjustedWidth || width),
      minWidth: valueToSize(minWidth),
      maxWidth: valueToSize(maxWidth),
      height: valueToSize(height),
      minHeight: valueToSize(minHeight),
      maxHeight: valueToSize(maxHeight),
    }),
    [adjustedWidth, minWidth, width, maxWidth, minHeight, height, maxHeight],
  );

  const bgColor = highlightShape ? HIGHLIGHT_BACKGROUND_COLOR : undefined;

  return (
    <StyledRoot
      noBorder={toolbarOpts && toolbarOpts.noBorder}
      error={toolbarOpts && toolbarOpts.error}
      className={props.className}
      style={{ width: sizeStyle.width, minWidth: sizeStyle.minWidth, maxWidth: sizeStyle.maxWidth }}
      ref={rootRef}
    >
      <StyledEditorHolder disableScrollbar={disableScrollbar} bgColor={bgColor}>
        <StyledChildren noPadding={toolbarOpts && toolbarOpts.noPadding}>{children}</StyledChildren>
      </StyledEditorHolder>

      {editor && (
        <StyledMenuBar
          editor={editor}
          responseAreaProps={responseAreaProps}
          toolbarOpts={toolbarOpts}
          activePlugins={activePlugins}
          onChange={props.onChange}
        />
      )}
    </StyledRoot>
  );
}

export default TiptapContainer;
