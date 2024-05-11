import React from 'react';
import { Editor } from 'slate';
import debug from 'debug';
import isHotkey from 'is-hotkey';

const log = debug('@pie-lib:editable-html:plugins');

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export default function MarkHotkey(options) {
  const { type, key, icon, tag } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    toolbar: {
      isMark: true,
      type,
      icon,
      onToggle: (editor) => {
        log('[onToggleMark] type: ', type);
        toggleMark(editor, type);
      },
    },
    renderMark(props) {
      if (props.mark.type === type) {
        const K = tag || type;
        return <K>{props.children}</K>;
      }
    },
    onKeyDown: (editor, event) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
          return true;
        }
      }
    },
  };
}
