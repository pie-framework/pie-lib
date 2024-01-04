import React from 'react';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debug from 'debug';
import get from 'lodash/get';

import { PureToolbar } from '../../../math-toolbar';

import CustomPopper from './custom-popper';
import { insertSnackBar } from '../respArea/utils';
import { characterIcons, spanishConfig, specialConfig } from './utils';
const log = debug('@pie-lib:editable-html:plugins:characters');

const removePopOvers = () => {
  const prevPopOvers = document.querySelectorAll('#mouse-over-popover');

  log('[characters:removePopOvers]');
  prevPopOvers.forEach((s) => s.remove());
};

export const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-character-dialog');

  log('[characters:removeDialogs]');
  prevDialogs.forEach((s) => s.remove());
  removePopOvers();
};

const insertDialog = ({ editor, callback, opts }) => {
  const newEl = document.createElement('div');

  log('[characters:insertDialog]');

  removeDialogs();

  newEl.className = 'insert-character-dialog';

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

  if (!configToUse.characters) {
    insertSnackBar('No characters provided or language not recognized');
    return;
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

  let popoverEl;

  const closePopOver = () => {
    if (popoverEl) {
      popoverEl.remove();
    }

    removePopOvers();
  };

  const renderPopOver = (event, el) => {
    if (!event) {
      return;
    }

    const infoStyle = { fontSize: '20px', lineHeight: '20px' };

    closePopOver();

    popoverEl = document.createElement('div');
    ReactDOM.render(
      <CustomPopper onClose={closePopOver} anchorEl={event.currentTarget}>
        <div>{el.label}</div>

        <div style={infoStyle}>{el.description}</div>

        <div style={infoStyle}>{el.unicode}</div>
      </CustomPopper>,
      popoverEl,
    );

    document.body.appendChild(newEl);
  };

  let firstCallMade = false;

  const listener = (e) => {
    // this will be triggered right after setting it because
    // this toolbar is added on the mousedown event
    // so right after mouseup, the click will be triggered
    if (firstCallMade) {
      const focusIsInModals = newEl.contains(e.target) || (popoverEl && popoverEl.contains(e.target));
      const editorDOM = ReactEditor.toDOMNode(editor, editor);
      const focusIsInEditor = editorDOM.contains(e.target);

      if (!(focusIsInModals || focusIsInEditor)) {
        handleClose();
      }
    } else {
      firstCallMade = true;
    }
  };

  const handleClose = () => {
    callback(undefined, true);
    newEl.remove();
    closePopOver();
    document.body.removeEventListener('click', listener);
  };

  const handleChange = (val) => {
    if (typeof val === 'string') {
      callback(val);
    }
  };

  const el = (
    <PureToolbar
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
      onDone={handleClose}
    />
  );

  ReactDOM.render(el, newEl, () => {
    const [nodeAtSelection] = Editor.node(editor, editor.selection);
    const cursorItem = ReactEditor.toDOMNode(editor, nodeAtSelection);

    if (cursorItem) {
      const bodyRect = document.body.getBoundingClientRect();
      const boundRect = cursorItem.getBoundingClientRect();

      document.body.appendChild(newEl);

      // when height of toolbar exceeds screen - can happen in scrollable contexts
      let additionalTopOffset = 0;
      if (boundRect.y < newEl.offsetHeight) {
        additionalTopOffset = newEl.offsetHeight - boundRect.y + 10;
      }

      newEl.style.maxWidth = '500px';
      newEl.style.position = 'absolute';
      newEl.style.top = `${boundRect.top + Math.abs(bodyRect.top) - newEl.offsetHeight - 10 + additionalTopOffset}px`;
      newEl.style.zIndex = 99999;

      const leftValue = `${boundRect.left + Math.abs(bodyRect.left) + cursorItem.offsetWidth + 10}px`;

      const rightValue = `${boundRect.x}px`;

      newEl.style.left = leftValue;

      const leftAlignedWidth = newEl.offsetWidth;

      newEl.style.left = 'unset';
      newEl.style.right = rightValue;

      const rightAlignedWidth = newEl.offsetWidth;

      newEl.style.left = 'unset';
      newEl.style.right = 'unset';

      if (leftAlignedWidth >= rightAlignedWidth) {
        newEl.style.left = leftValue;
      } else {
        newEl.style.right = rightValue;
      }

      document.body.addEventListener('click', listener);
    }
  });
};

const CharacterIcon = ({ letter }) => (
  <div
    style={{
      fontSize: '25px',
      lineHeight: '15px',
    }}
  >
    {letter}
  </div>
);

CharacterIcon.propTypes = {
  letter: PropTypes.string,
};

export default function CharactersPlugin(opts) {
  removeDialogs();
  return {
    name: 'characters',
    toolbar: {
      icon: <CharacterIcon letter={opts.characterIcon || characterIcons[opts.language] || 'ñ'} />,
      onClick: (editor) => {
        const callback = (char, focus) => {
          if (char) {
            log('[characters:insert]: ', char);
            editor.insertText(char);
          }

          log('[characters:click]');

          if (focus) {
            ReactEditor.focus(editor);
          }
        };

        insertDialog({ editor, callback, opts });
      },
    },

    pluginStyles: (node, parentNode, p) => {
      if (p) {
        return {
          position: 'absolute',
          top: 'initial',
        };
      }
    },
  };
}
