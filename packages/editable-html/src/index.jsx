import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { NodeSelection } from 'prosemirror-state';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import SuperScript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';

import { withStyles } from '@material-ui/core/styles';
import {
  ExplicitConstructedResponseNode,
  DragInTheBlankNode,
  InlineDropdownNode,
  ResponseAreaExtension
} from "./extensions/responseArea";
import { MathNode, MathToolbarExtension } from "./extensions/math";
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';
import { primary } from './theme';
import { PIE_TOOLBAR__CLASS } from './constants';
import { DoneButton } from './plugins/toolbar/done-button';
import Bold from '@material-ui/icons/FormatBold';
import Italic from '@material-ui/icons/FormatItalic';
import Strikethrough from '@material-ui/icons/FormatStrikethrough';
import Code from '@material-ui/icons/Code';
import GridOn from '@material-ui/icons/GridOn';
import BulletedListIcon from '@material-ui/icons/FormatListBulleted';
import NumberedListIcon from '@material-ui/icons/FormatListNumbered';
import Underline from '@material-ui/icons/FormatUnderlined';
import Functions from '@material-ui/icons/Functions';
import { ToolbarIcon } from './plugins/respArea/icons';
import Image from '@material-ui/icons/Image';
import Redo from '@material-ui/icons/Redo';
import Undo from '@material-ui/icons/Undo';
import { characterIcons, spanishConfig, specialConfig } from './plugins/characters/utils';
import PropTypes from 'prop-types';
import { MathToolbar, PureToolbar } from '@pie-lib/math-toolbar';
import get from 'lodash/get';
import CustomPopper from './plugins/characters/custom-popper';
import TextAlignIcon from './plugins/textAlign/icons';

const CharacterIcon = ({ letter }) => (
  <div
    style={{
      fontSize: '24px',
      lineHeight: '24px',
    }}
  >
    {letter}
  </div>
);

CharacterIcon.propTypes = {
  letter: PropTypes.string,
};

export function CharacterPicker({ editor, opts, onClose }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  let configToUse;

  switch (true) {
    case opts.language === 'spanish':
      configToUse = spanishConfig;
      break;
    case opts.language === 'special':
      configToUse = specialConfig;
      break;
    default:
      configToUse = opts;
  }

  const layoutForCharacters = configToUse.characters.reduce(
    (obj, arr) => {
      if (arr.length >= obj.columns) {
        obj.columns = arr.length;
      }

      return obj;
    },
    { rows: configToUse.characters.length, columns: 0 },
  );

  useEffect(() => {
    if (!editor) return;

    // Calculate position relative to selection
    const bodyRect = document.body.getBoundingClientRect();
    const { from } = editor.state.selection;
    const start = editor.view.coordsAtPos(from);
    setPosition({
      top: start.top + Math.abs(bodyRect.top) + 40, // shift above
      left: start.left,
    });

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && !editor.view.dom.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editor]);

  if (!opts?.characters?.length) {
    return null;
  }

  const removePopOvers = () => {
    const prevPopOvers = document.querySelectorAll('#mouse-over-popover');

    console.log('[characters:removePopOvers]');
    prevPopOvers.forEach((s) => s.remove());
  };

  let popoverRoot = null;

  const closePopOver = () => {
    if (popoverRoot) {
      popoverRoot.unmount();
      popoverRoot = null;
    }

    const existing = document.getElementById('popover-container');
    if (existing) existing.remove();
  };

  const renderPopOver = (event, el) => {
    if (!event) return;

    const infoStyle = { fontSize: '20px', lineHeight: '20px' };

    closePopOver(); // Close any previous popover

    const container = document.createElement('div');
    container.id = 'popover-container';
    document.body.appendChild(container);

    popoverRoot = createRoot(container);

    popoverRoot.render(
      <CustomPopper onClose={closePopOver} anchorEl={event.currentTarget}>
        <div>{el.label}</div>
        <div style={infoStyle}>{el.description}</div>
        <div style={infoStyle}>{el.unicode}</div>
      </CustomPopper>,
    );
  };

  const handleChange = (val) => {
    if (typeof val === 'string') {
      editor
        .chain()
        .focus()
        .insertContent(val)
        .run();
    }
  };

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      className="insert-character-dialog"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth: '500px',
      }}
    >
      <div>
        <PureToolbar
          keyPadCharacterRef={opts.keyPadCharacterRef}
          setKeypadInteraction={opts.setKeypadInteraction}
          autoFocus
          noDecimal
          hideInput
          noLatexHandling
          hideDoneButtonBackground
          layoutForKeyPad={layoutForCharacters}
          additionalKeys={configToUse.characters.reduce((arr, n) => {
            arr = [
              ...arr,
              ...n.map((k) => ({
                name: get(k, 'name') || k,
                write: get(k, 'write') || k,
                label: get(k, 'label') || k,
                category: 'character',
                extraClass: 'character',
                extraProps: {
                  ...(k.extraProps || {}),
                  style: {
                    ...(k.extraProps || {}).style,
                    border: '1px solid #000',
                  },
                },
                ...(configToUse.hasPreview
                  ? {
                      actions: { onMouseEnter: (ev) => renderPopOver(ev, k), onMouseLeave: closePopOver },
                    }
                  : {}),
              })),
            ];

            return arr;
          }, [])}
          keypadMode="language"
          onChange={handleChange}
          onDone={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}

const SuperscriptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
    <path
      d="M22,7h-2v1h3v1h-4V7c0-0.55,0.45-1,1-1h2V5h-3V4h3c0.55,0,1,0.45,1,1v1C23,6.55,22.55,7,22,7z M5.88,20h2.66l3.4-5.42h0.12 l3.4,5.42h2.66l-4.65-7.27L17.81,6h-2.68l-3.07,4.99h-0.12L8.85,6H6.19l4.32,6.73L5.88,20z"
      fill="currentColor"
    />
  </svg>
);

const SubscriptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
    <path
      d="M22,18h-2v1h3v1h-4v-2c0-0.55,0.45-1,1-1h2v-1h-3v-1h3c0.55,0,1,0.45,1,1v1C23,17.55,22.55,18,22,18z M5.88,18h2.66 l3.4-5.42h0.12l3.4,5.42h2.66l-4.65-7.27L17.81,4h-2.68l-3.07,4.99h-0.12L8.85,4H6.19l4.32,6.73L5.88,18z"
      fill="currentColor"
    />
  </svg>
);

const HeadingIcon = () => (
  <svg
    width="30"
    height="28"
    viewBox="0 0 30 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '20px', height: '18px' }}
  >
    <path
      d="M27 4V24H29C29.5 24 30 24.5 30 25V27C30 27.5625 29.5 28 29 28H19C18.4375 28 18 27.5625 18 27V25C18 24.5 18.4375 24 19 24H21V16H9V24H11C11.5 24 12 24.5 12 25V27C12 27.5625 11.5 28 11 28H1C0.4375 28 0 27.5625 0 27V25C0 24.5 0.4375 24 1 24H3V4H1C0.4375 4 0 3.5625 0 3V1C0 0.5 0.4375 0 1 0H11C11.5 0 12 0.5 12 1V3C12 3.5625 11.5 4 11 4H9V12H21V4H19C18.4375 4 18 3.5625 18 3V1C18 0.5 18.4375 0 19 0H29C29.5 0 30 0.5 30 1V3C30 3.5625 29.5 4 29 4H27Z"
      fill="currentColor"
    />
  </svg>
);

const ExtendedTable = Table.extend({
  renderHTML(props) {
    const originalTable = this.parent(props);

    originalTable[1].style = `${originalTable[1].style} width: 100%;
    color: var(--pie-text, black);
    table-layout: fixed;
    border-collapse: collapse;
    background-color: var(--pie-background, rgba(255, 255, 255))`;
    originalTable[1].border = '1';

    return originalTable;
  },
});

const styles = (theme) => ({
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
      fontFamily: "'JetBrainsMono', monospace",
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

const defaultResponseAreaProps = {
  options: {},
  respAreaToolbar: () => {},
  onHandleAreaChange: () => {},
};

function TiptapContainer(props) {
  const { editor, editorState, classes, children, disableUnderline, disableScrollbar, toolbarOpts, responseAreaProps, autoFocus } = props;
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
          {children}
        </div>
      </div>

      {/*{editorState.isFocused && <MenuBar editor={editor} />}*/}
      {/*<Toolbar editor={editor} editorState={editorState} plugins={plugins} toolbarOpts={toolbarOpts} isFocused={editorState.isFocused} />*/}
      {editor && <StyledMenuBar editor={editor} responseAreaProps={responseAreaProps} toolbarOpts={toolbarOpts} onChange={props.onChange} />}
    </div>
  );
}

const EditorContainer = withStyles(styles)(TiptapContainer);

function MenuBar({ editor, classes, toolbarOpts: toolOpts, responseAreaProps, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const toolbarOpts = toolOpts ?? {};
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      const { selection } = ctx.editor?.state || {};

      let currentNode;

      if (selection instanceof NodeSelection) {
        currentNode = selection.node; // the selected node
      }

      return {
        currentNode,
        isFocused: ctx.editor?.isFocused,
        isMathActive: ctx.editor?.isActive('math') ?? false,
        isECRActive: ctx.editor?.isActive('explicit_constructed_response') ?? false,
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold:
          ctx.editor
            .can()
            .chain()
            .toggleBold()
            .run() ?? false,
        isTable: ctx.editor.isActive('table') ?? false,
        canTable:
          ctx.editor
            .can()
            .chain()
            .insertTable()
            .run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic:
          ctx.editor
            .can()
            .chain()
            .toggleItalic()
            .run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike:
          ctx.editor
            .can()
            .chain()
            .toggleStrike()
            .run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode:
          ctx.editor
            .can()
            .chain()
            .toggleCode()
            .run() ?? false,
        canClearMarks:
          ctx.editor
            .can()
            .chain()
            .unsetAllMarks()
            .run() ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        isSubScript: ctx.editor.isActive('subscript') ?? false,
        isSuperScript: ctx.editor.isActive('superscript') ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo:
          ctx.editor
            .can()
            .chain()
            .undo()
            .run() ?? false,
        canRedo:
          ctx.editor
            .can()
            .chain()
            .redo()
            .run() ?? false,
      };
    },
  });
  const hasDoneButton = false;
  const autoWidth = false;

  const names = classNames(classes.toolbar, PIE_TOOLBAR__CLASS, {
    [classes.toolbarWithNoDone]: !hasDoneButton,
    [classes.toolbarTop]: toolbarOpts.position === 'top',
    [classes.toolbarRight]: toolbarOpts.alignment === 'right',
    [classes.focused]: toolbarOpts.alwaysVisible || editorState.isFocused,
    [classes.autoWidth]: autoWidth,
    [classes.fullWidth]: !autoWidth,
    [classes.hidden]: toolbarOpts.isHidden === true,
  });
  const customStyles = toolbarOpts.minWidth !== undefined ? { minWidth: toolbarOpts.minWidth } : {};
  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  const attrs = editor?.getAttributes('math');

  const handleMathChange = (latex) => {
    editor.commands.updateAttributes('math', { latex });
  };

  const handleMathDone = (latex) => {
    editor.commands.updateAttributes('math', { latex });
    editor.commands.focus();
  };

  let EcrToolbar;

  if (editorState.isECRActive) {
    EcrToolbar = responseAreaProps.respAreaToolbar(editorState.currentNode, editor, () => {});
  }

  return (
    <div className={names} style={{ ...customStyles }} onMouseDown={handleMouseDown}>
      {/*{
        editorState.isECRActive && (
          <EcrToolbar />
        )
      }*/}
      {/*{
        editorState.isMathActive && (<MathToolbar
          latex={attrs.latex || ''}
          onChange={handleMathChange}
          onDone={handleMathDone}
          keypadMode="basic"
        />)
      }*/}
      {
        (!editorState.isMathActive && !editorState.isECRActive) && (
          <div className={classes.defaultToolbar} tabIndex="1">
            <div className={classes.buttonsContainer}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .insertTable()
                    .run();
                }}
                disabled={!editorState.canTable}
                className={classNames(classes.button, { [classes.active]: editorState.isTable })}
              >
                <GridOn />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .toggleBold()
                    .run();
                }}
                disabled={!editorState.canBold}
                className={classNames(classes.button, { [classes.active]: editorState.isBold })}
              >
                <Bold />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
                disabled={!editorState.canItalic}
                active={editorState.isItalic}
                className={classNames(classes.button, { [classes.active]: editorState.isItalic })}
              >
                <Italic />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
                }
                disabled={!editorState.canStrike}
                active={editorState.isStrike}
                className={classNames(classes.button, { [classes.active]: editorState.isStrike })}
              >
                <Strikethrough />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleCode()
                    .run()
                }
                disabled={!editorState.canCode}
                active={editorState.isCode}
                className={classNames(classes.button, { [classes.active]: editorState.isCode })}
              >
                <Code />
              </button>
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .unsetAllMarks()*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*>*/}
              {/*  Clear marks*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .clearNodes()*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*>*/}
              {/*  Clear nodes*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .setParagraph()*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={editorState.isParagraph ? classes.isActive : ''}*/}
              {/*>*/}
              {/*  Paragraph*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleHeading({ level: 1 })*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={editorState.isHeading1 ? classes.isActive : ''}*/}
              {/*>*/}
              {/*  H1*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleHeading({ level: 2 })*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={editorState.isHeading2 ? classes.isActive : ''}*/}
              {/*>*/}
              {/*  H2*/}
              {/*</button>*/}
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleUnderline()
                    .run()
                }
                className={classNames(classes.button, { [classes.active]: editorState.isUnderline })}
              >
                <Underline />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleSubscript()
                    .run()
                }
                className={classNames(classes.button, { [classes.active]: editorState.isSubScript })}
              >
                <SubscriptIcon />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleSuperscript()
                    .run()
                }
                className={classNames(classes.button, { [classes.active]: editorState.isSuperScript })}
              >
                <SuperscriptIcon />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: 3 })
                    .run()
                }
                className={classNames(classes.button, { [classes.active]: editorState.isHeading3 })}
              >
                <HeadingIcon />
              </button>
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleHeading({ level: 3 })*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={classNames(classes.button, { [classes.active]: editorState.isHeading3 })}*/}
              {/*>*/}
              {/*  <Image />*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleHeading({ level: 4 })*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={editorState.isHeading4 ? classes.isActive : ''}*/}
              {/*>*/}
              {/*  H4*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleHeading({ level: 5 })*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={editorState.isHeading5 ? classes.isActive : ''}*/}
              {/*>*/}
              {/*  H5*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleHeading({ level: 6 })*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={editorState.isHeading6 ? classes.isActive : ''}*/}
              {/*>*/}
              {/*  H6*/}
              {/*</button>*/}
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertMath('')
                    .run()
                }
                className={classes.button}
              >
                <Functions />
              </button>
              <button onClick={() => setShowPicker(spanishConfig)} className={classes.button}>
                <CharacterIcon letter="ñ" />
              </button>
              <button onClick={() => setShowPicker(specialConfig)} className={classes.button}>
                <CharacterIcon letter="€" />
              </button>
              <button onClick={() => {}} className={classes.button}>
                <TextAlignIcon editor={editor} />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBulletList()
                    .run()
                }
                className={classNames(classes.button, { [classes.active]: editorState.isBulletList })}
              >
                <BulletedListIcon />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleOrderedList()
                    .run()
                }
                className={classNames(classes.button, { [classes.active]: editorState.isOrderedList })}
              >
                <NumberedListIcon />
              </button>
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleCodeBlock()*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={classNames(classes.button, { [classes.active]: editorState.isCodeBlock })}*/}
              {/*>*/}
              {/*  Code block*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .toggleBlockquote()*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*  className={classNames(classes.button, { [classes.active]: editorState.isBlockquote })}*/}
              {/*>*/}
              {/*  Blockquote*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .setHorizontalRule()*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*>*/}
              {/*  Horizontal rule*/}
              {/*</button>*/}
              {/*<button*/}
              {/*  onClick={() =>*/}
              {/*    editor*/}
              {/*      .chain()*/}
              {/*      .focus()*/}
              {/*      .setHardBreak()*/}
              {/*      .run()*/}
              {/*  }*/}
              {/*>*/}
              {/*  Hard break*/}
              {/*</button>*/}
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .undo()
                    .run()
                }
                disabled={!editorState.canUndo}
                className={classes.button}
              >
                <Undo />
              </button>
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .redo()
                    .run()
                }
                disabled={!editorState.canRedo}
                className={classes.button}
              >
                <Redo />
              </button>
            </div>
            <button
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .insertResponseArea(responseAreaProps.type)
                  .run();
              }}
              className={classes.button}
            >
              <ToolbarIcon />
            </button>

            <DoneButton
              onClick={() => {
                onChange?.(editor.getHTML());
                editor.commands.blur();
              }}
            />
          </div>
        )
      }
      {showPicker && (
        <CharacterPicker
          editor={editor}
          opts={{
            ...showPicker,
            renderPopOver: (ev, ch) => console.log('Show popover', ch),
            closePopOver: () => console.log('Close popover'),
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

const style = (theme) => ({
  defaultToolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
  },
  button: {
    color: 'grey',
    display: 'inline-flex',
    padding: '2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      color: 'black',
    },
    '&:focus': {
      outline: `2px solid ${theme.palette.grey[700]}`,
    },
  },
  active: {
    color: 'black',
  },
  disabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    '& :hover': {
      color: 'grey',
    },
  },
  isActive: {
    background: 'var(--purple)',
    color: 'var(--white)',
  },
  toolbar: {
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer',
    justifyContent: 'space-between',
    background: 'var(--editable-html-toolbar-bg, #efefef)',
    minWidth: '280px',
    margin: '5px 0 0 0',
    padding: '2px',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    boxSizing: 'border-box',
    display: 'flex',
    opacity: 0,
    pointerEvents: 'none',
  },
  toolbarWithNoDone: {
    minWidth: '265px',
  },
  toolbarTop: {
    top: '-45px',
  },
  toolbarRight: {
    right: 0,
  },
  fullWidth: {
    width: '100%',
  },
  hidden: {
    visibility: 'hidden',
  },
  autoWidth: {
    width: 'auto',
  },
  focused: {
    opacity: 1,
    pointerEvents: 'auto',
  },
  iconRoot: {
    width: '28px',
    height: '28px',
    padding: '4px',
    verticalAlign: 'top',
  },
  label: {
    color: 'var(--editable-html-toolbar-check, #00bb00)',
  },
  shared: {
    display: 'flex',
  },
});
const StyledMenuBar = withStyles(style, { index: 1000 })(MenuBar);

export const EditableHtml = (props) => {
  const { classes } = props;
  const extensions = [
    TextStyleKit,
    StarterKit,
    ExtendedTable,
    TableRow,
    TableHeader,
    TableCell,
    ResponseAreaExtension,
    ExplicitConstructedResponseNode.configure(props.responseAreaProps),
    DragInTheBlankNode.configure(props.responseAreaProps),
    InlineDropdownNode.configure(props.responseAreaProps),
    MathNode,
    // MathToolbarExtension,
    SubScript,
    SuperScript,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'right', 'center'],
    }),
  ];
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content: props.markup,
    onUpdate: ({ editor, transaction }) => transaction.isDone && props.onChange?.(editor.getHTML()),
    onBlur: ({ editor }) => props.onDone?.(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (props.markup !== editor.getHTML()) {
      editor.commands.setContent(props.markup, false); // false = don’t emit update
    }
  }, [props.markup, editor]);

  useEffect(() => {
    // Define your variables in a JS object
    const cssVariables = {
      '--white': '#fff',
      '--black': '#2e2b29',
      '--black-contrast': '#110f0e',
      '--gray-1': 'rgba(61, 37, 20, .05)',
      '--gray-2': 'rgba(61, 37, 20, .08)',
      '--gray-3': 'rgba(61, 37, 20, .12)',
      '--gray-4': 'rgba(53, 38, 28, .3)',
      '--gray-5': 'rgba(28, 25, 23, .6)',
      '--green': '#22c55e',
      '--purple': '#6a00f5',
      '--purple-contrast': '#5800cc',
      '--purple-light': 'rgba(88, 5, 255, .05)',
      '--yellow-contrast': '#facc15',
      '--yellow': 'rgba(250, 204, 21, .4)',
      '--yellow-light': '#fffae5',
      '--red': '#ff5c33',
      '--red-light': '#ffebe5',
      '--shadow': `0px 12px 33px 0px rgba(0, 0, 0, .06),
               0px 3.618px 9.949px 0px rgba(0, 0, 0, .04)`,
    };

    Object.entries(cssVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isFocused: ctx.editor?.isFocused,
      };
    },
  });

  return (
    <EditorContainer {...props} editorState={editorState} editor={editor}>
      {editor && <EditorContent className={classes.root} editor={editor} />}
    </EditorContainer>
  );
};

const StyledEditor = withStyles({
  root: {
    outline: 'none !important',
    '& .ProseMirror': {
      outline: 'none !important',
    },
  },
})(EditableHtml);

export default StyledEditor;
