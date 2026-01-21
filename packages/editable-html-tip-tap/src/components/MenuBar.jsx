import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { styled, useTheme } from '@mui/material/styles';
import { NodeSelection } from 'prosemirror-state';

import Bold from '@mui/icons-material/FormatBold';
import Italic from '@mui/icons-material/FormatItalic';
import Strikethrough from '@mui/icons-material/FormatStrikethrough';
import Code from '@mui/icons-material/Code';
import GridOn from '@mui/icons-material/GridOn';
import BulletedListIcon from '@mui/icons-material/FormatListBulleted';
import NumberedListIcon from '@mui/icons-material/FormatListNumbered';
import Underline from '@mui/icons-material/FormatUnderlined';
import Functions from '@mui/icons-material/Functions';
import ImageIcon from '@mui/icons-material/Image';
import Redo from '@mui/icons-material/Redo';
import Undo from '@mui/icons-material/Undo';
import TheatersIcon from '@mui/icons-material/Theaters';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BorderAll from '@mui/icons-material/BorderAll';

import { EditorContent, useEditorState } from '@tiptap/react';

import { PIE_TOOLBAR__CLASS } from '../constants';
import { ToolbarIcon } from './respArea/ToolbarIcon';
import { spanishConfig, specialConfig } from './characters/characterUtils';
import TextAlignIcon from './icons/TextAlign';
import CSSIcon from './icons/CssIcon';
import { AddColumn, AddRow, RemoveColumn, RemoveRow, RemoveTable } from './icons/TableIcons';

import { CharacterIcon, CharacterPicker } from './CharacterPicker';
import { DoneButton } from './common/done-button';

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

function MenuBar({ editor, classes, activePlugins, toolbarOpts: toolOpts, responseAreaProps, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const toolbarOpts = toolOpts ?? {};

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      const { selection } = ctx.editor?.state || {};

      let currentNode;

      if (selection instanceof NodeSelection) {
        currentNode = selection.node; // the selected node
      }

      const hideDefaultToolbar =
        ctx.editor?.isActive('math') ||
        ctx.editor?.isActive('explicit_constructed_response') ||
        ctx.editor?.isActive('imageUploadNode');

      return {
        currentNode,
        hideDefaultToolbar,
        isFocused: ctx.editor?.isFocused,
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold:
          ctx.editor
            .can()
            .chain()
            .toggleBold()
            .run() ?? false,
        isTable: ctx.editor.isActive('table') ?? false,
        tableHasBorder: ctx.editor.getAttributes('table')?.border === '1' ?? false,
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
    [classes.focused]: toolbarOpts.alwaysVisible || (editorState.isFocused && !editor._toolbarOpened),
    [classes.autoWidth]: autoWidth,
    [classes.fullWidth]: !autoWidth,
    [classes.hidden]: toolbarOpts.isHidden === true,
  });

  const customStyles = toolbarOpts.minWidth !== undefined ? { minWidth: toolbarOpts.minWidth } : {};

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  const toolbarButtons = useMemo(
    () => [
      {
        icon: <GridOn />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 2, cols: 2, withHeaderRow: false })
            .run(),
        hidden: (state) => !activePlugins?.includes('table') || state.isTable,
        isActive: (state) => state.isTable,
        isDisabled: (state) => !state.canTable,
      },
      {
        icon: <AddRow />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .addRowAfter()
            .run(),
        hidden: (state) => !state.isTable,
        isActive: (state) => state.isTable,
        isDisabled: (state) => !state.canTable,
      },
      {
        icon: <RemoveRow />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .deleteRow()
            .run(),
        hidden: (state) => !state.isTable,
        isActive: (state) => state.isTable,
        isDisabled: (state) => !state.canTable,
      },
      {
        icon: <AddColumn />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .addColumnAfter()
            .run(),
        hidden: (state) => !state.isTable,
        isActive: (state) => state.isTable,
        isDisabled: (state) => !state.canTable,
      },
      {
        icon: <RemoveColumn />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .deleteColumn()
            .run(),
        hidden: (state) => !state.isTable,
        isActive: (state) => state.isTable,
        isDisabled: (state) => !state.canTable,
      },
      {
        icon: <RemoveTable />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .deleteTable()
            .run(),
        hidden: (state) => !state.isTable,
        isActive: (state) => state.isTable,
        isDisabled: (state) => !state.canTable,
      },
      {
        icon: <BorderAll />,
        onClick: (editor) => {
          const tableAttrs = editor.getAttributes('table');

          const update = {
            ...tableAttrs,
            border: tableAttrs.border !== '0' ? '0' : '1',
          };

          editor.commands.updateAttributes('table', update);
        },
        hidden: (state) => !state.isTable,
        isActive: (state) => state.tableHasBorder,
        isDisabled: (state) => !state.canTable,
      },
      {
        icon: <Bold />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run(),
        hidden: (state) => !activePlugins?.includes('bold') || state.isTable,
        isActive: (state) => state.isBold,
        isDisabled: (state) => !state.canBold,
      },
      {
        icon: <Italic />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run(),
        hidden: (state) => !activePlugins?.includes('italic') || state.isTable,
        isActive: (state) => state.isItalic,
        isDisabled: (state) => !state.canItalic,
      },
      {
        icon: <Strikethrough />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleStrike()
            .run(),
        hidden: (state) => !activePlugins?.includes('strikethrough') || state.isTable,
        isActive: (state) => state.isStrike,
        isDisabled: (state) => !state.canStrike,
      },
      {
        icon: <Code />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleCode()
            .run(),
        hidden: (state) => !activePlugins?.includes('code') || state.isTable,
        isActive: (state) => state.isCode,
        isDisabled: (state) => !state.canCode,
      },
      {
        icon: <Underline />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleUnderline()
            .run(),
        hidden: (state) => !activePlugins?.includes('underline') || state.isTable,
        isActive: (state) => state.isUnderline,
      },
      {
        icon: <SubscriptIcon />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleSubscript()
            .run(),
        hidden: (state) => !activePlugins?.includes('subscript') || state.isTable,
        isActive: (state) => state.isSubScript,
      },
      {
        icon: <SuperscriptIcon />,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleSuperscript()
            .run(),
        hidden: (state) => !activePlugins?.includes('superscript') || state.isTable,
        isActive: (state) => state.isSuperScript,
      },
      {
        icon: <ImageIcon />,
        hidden: (state) => !activePlugins?.includes('image') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .setImageUploadNode()
            .run(),
      },
      {
        icon: <TheatersIcon />,
        hidden: (state) => !activePlugins?.includes('video') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .insertMedia({ type: 'video' })
            .run(),
      },
      {
        icon: <VolumeUpIcon />,
        hidden: (state) => !activePlugins?.includes('audio') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .insertMedia({ type: 'audio', tag: 'audio' })
            .run(),
      },
      {
        icon: <CSSIcon />,
        hidden: (state) => !activePlugins?.includes('css') || state.isTable,
        onClick: (editor) => editor.commands.openCSSClassDialog(),
      },
      {
        icon: <HeadingIcon />,
        hidden: (state) => !activePlugins?.includes('h3') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run(),
        isActive: (state) => state.isHeading3,
      },
      {
        icon: <Functions />,
        hidden: () => !activePlugins?.includes('math'),
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .insertMath('')
            .run(),
      },
      {
        icon: <CharacterIcon letter="ñ" />,
        hidden: (state) => !activePlugins?.includes('languageCharacters') || state.isTable,
        onClick: () => setShowPicker(spanishConfig),
      },
      {
        icon: <CharacterIcon letter="€" />,
        hidden: (state) => activePlugins?.filter((p) => p === 'languageCharacters').length !== 2 || state.isTable,
        onClick: () => setShowPicker(specialConfig),
      },
      {
        icon: <TextAlignIcon editor={editor} />,
        hidden: (state) => !activePlugins?.includes('text-align') || state.isTable,
        onClick: () => {},
      },
      {
        icon: <BulletedListIcon />,
        hidden: (state) => !activePlugins?.includes('bulleted-list') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run(),
        isActive: (state) => state.isBulletList,
      },
      {
        icon: <NumberedListIcon />,
        hidden: (state) => !activePlugins?.includes('numbered-list') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run(),
        isActive: (state) => state.isOrderedList,
      },
      {
        icon: <Undo />,
        hidden: (state) => !activePlugins?.includes('undo') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .undo()
            .run(),
        isDisabled: (state) => !state.canUndo,
      },
      {
        icon: <Redo />,
        hidden: (state) => !activePlugins?.includes('redo') || state.isTable,
        onClick: (editor) =>
          editor
            .chain()
            .focus()
            .redo()
            .run(),
        isDisabled: (state) => !state.canRedo,
      },
    ],
    [activePlugins, editor],
  );

  return (
    <div className={names} style={{ ...customStyles }} onMouseDown={handleMouseDown}>
      {!editorState.hideDefaultToolbar && (
        <div className={classes.defaultToolbar} tabIndex="1">
          <div className={classes.buttonsContainer}>
            {toolbarButtons
              .filter((btn) => !btn.hidden?.(editorState))
              .map((btn, index) => {
                const disabled = btn.isDisabled?.(editorState);
                const active = btn.isActive?.(editorState);

                return (
                  <button
                    key={index}
                    disabled={disabled}
                    onClick={(e) => {
                      e.preventDefault();
                      btn.onClick(editor);
                    }}
                    className={classNames(classes.button, { [classes.active]: active })}
                  >
                    {btn.icon}
                  </button>
                );
              })}
          </div>
          {activePlugins?.includes('responseArea') && (
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
          )}

          {toolbarOpts.showDone && (
            <DoneButton
              onClick={() => {
                onChange?.(editor.getHTML());
                editor.commands.blur();
              }}
            />
          )}
        </div>
      )}
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

// Wrapper component that provides classes object using styled API
const StyledMenuBar = (props) => {
  const theme = useTheme();

  const classes = {
    defaultToolbar: 'defaultToolbar',
    buttonsContainer: 'buttonsContainer',
    button: 'button',
    active: 'active',
    disabled: 'disabled',
    isActive: 'isActive',
    toolbar: 'toolbar',
    toolbarWithNoDone: 'toolbarWithNoDone',
    toolbarTop: 'toolbarTop',
    toolbarRight: 'toolbarRight',
    fullWidth: 'fullWidth',
    hidden: 'hidden',
    autoWidth: 'autoWidth',
    focused: 'focused',
    iconRoot: 'iconRoot',
    label: 'label',
    shared: 'shared',
  };

  return (
    <StyledMenuBarRoot>
      <MenuBar {...props} classes={classes} />
    </StyledMenuBarRoot>
  );
};

const StyledMenuBarRoot = styled('div')(({ theme }) => ({
  '& .defaultToolbar': {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  '& .buttonsContainer': {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
  },
  '& .button': {
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
  '& .active': {
    color: 'black',
  },
  '& .disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
    '& :hover': {
      color: 'grey',
    },
  },
  '& .isActive': {
    background: 'var(--purple)',
    color: 'var(--white)',
  },
  '& .toolbar': {
    position: 'absolute',
    zIndex: 20,
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
  '& .toolbarWithNoDone': {
    minWidth: '265px',
  },
  '& .toolbarTop': {
    top: '-45px',
  },
  '& .toolbarRight': {
    right: 0,
  },
  '& .fullWidth': {
    width: '100%',
  },
  '& .hidden': {
    visibility: 'hidden',
  },
  '& .autoWidth': {
    width: 'auto',
  },
  '& .focused': {
    opacity: 1,
    pointerEvents: 'auto',
  },
  '& .iconRoot': {
    width: '28px',
    height: '28px',
    padding: '4px',
    verticalAlign: 'top',
  },
  '& .label': {
    color: 'var(--editable-html-toolbar-check, #00bb00)',
  },
  '& .shared': {
    display: 'flex',
  },
}));

export default StyledMenuBar;
