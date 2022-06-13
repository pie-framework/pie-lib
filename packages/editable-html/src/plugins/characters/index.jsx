import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import get from 'lodash/get';

import { PureToolbar } from '@pie-lib/math-toolbar';

import CustomPopOver from './custom-popover';
import { insertSnackBar } from '../respArea/utils';
import { characterIcons, spanishConfig, specialConfig } from './utils';
const log = debug('@pie-lib:editable-html:plugins:characters');

const removeDialogs = () => {
  const prevDialogs = document.querySelectorAll('.insert-character-dialog');

  log('[characters:removeDialogs]');
  prevDialogs.forEach(s => s.remove());
};

const removePopOvers = () => {
  const prevPopOvers = document.querySelectorAll('#mouse-over-popover');

  log('[characters:removePopOvers]');
  prevPopOvers.forEach(s => s.remove());
};

const insertDialog = ({ value, callback, opts }) => {
  const newEl = document.createElement('div');
  const initialBodyOverflow = document.body.style.overflow;

  log('[characters:insertDialog]');

  removeDialogs();

  newEl.className = 'insert-character-dialog';
  document.body.style.overflow = 'hidden';

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
    { rows: configToUse.characters.length, columns: 0 }
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
      <CustomPopOver onClose={closePopOver} anchorEl={event.currentTarget}>
        <div>{el.label}</div>

        <div style={infoStyle}>{el.description}</div>

        <div style={infoStyle}>{el.unicode}</div>
      </CustomPopOver>,
      popoverEl
    );

    document.body.appendChild(newEl);
  };

  const handleClose = () => {
    newEl.remove();
    closePopOver();
    document.body.style.overflow = initialBodyOverflow;
    callback(undefined, true);
  };

  const handleChange = val => {
    if (typeof val === 'string') {
      callback(val);
    }

    if (configToUse.autoClose) {
      handleClose();
    }
  };

  const el = (
    <PureToolbar
      autoFocus
      noDecimal
      hideInput
      noLatexHandling
      layoutForKeyPad={layoutForCharacters}
      additionalKeys={configToUse.characters.reduce((arr, n) => {
        arr = [
          ...arr,
          ...n.map(k => ({
            name: get(k, 'name') || k,
            write: get(k, 'write') || k,
            label: get(k, 'label') || k,
            category: 'character',
            extraClass: 'character',
            ...(configToUse.hasPreview
              ? {
                  actions: { onMouseEnter: ev => renderPopOver(ev, k), onMouseLeave: closePopOver }
                }
              : {})
          }))
        ];

        return arr;
      }, [])}
      keypadMode="language"
      onChange={handleChange}
      onDone={handleClose}
    />
  );

  ReactDOM.render(el, newEl, () => {
    const cursorItem = document.querySelector(`[data-key="${value.anchorKey}"]`);

    if (cursorItem) {
      const boundRect = cursorItem.getBoundingClientRect();

      document.body.appendChild(newEl);
      newEl.style.position = 'fixed';
      newEl.style.top = `${boundRect.top - newEl.offsetHeight - 10}px`;
      newEl.style.left = `${boundRect.left + cursorItem.offsetWidth + 10}px`;
      newEl.style.zIndex = 99999;

      let firstCallMade = false;

      const listener = () => {
        // this will be triggered right after setting it because
        // this toolbar is added on the mousedown event
        // so right after mouseup, the click will be triggered
        if (firstCallMade) {
          document.body.removeEventListener('click', listener);
          handleClose();
        } else {
          firstCallMade = true;
        }
      };

      if (configToUse.autoClose) {
        document.body.addEventListener('click', listener);
      }
    }
  });
};

const CharacterIcon = ({ letter }) => (
  <div
    style={{
      fontSize: '25px',
      lineHeight: '15px'
    }}
  >
    {letter}
  </div>
);

export default function CharactersPlugin(opts) {
  removeDialogs();
  return {
    name: 'math',
    toolbar: {
      icon: <CharacterIcon letter={opts.characterIcon || characterIcons[opts.language] || 'ñ'} />,
      onClick: (value, onChange) => {
        let valueToUse = value;
        const callback = (char, focus) => {
          if (char) {
            const change = valueToUse
              .change()
              .insertTextByKey(valueToUse.anchorKey, valueToUse.anchorOffset, char);

            valueToUse = change.value;
            log('[characters:insert]: ', value);
            onChange(change);
          }

          log('[characters:click]');

          if (focus) {
            const editorDOM = document.querySelector(`[data-key="${valueToUse.document.key}"]`);

            if (editorDOM) {
              editorDOM.focus();
            }
          }
        };

        insertDialog({ value: valueToUse, callback, opts });
      }
    },

    pluginStyles: (node, parentNode, p) => {
      if (p) {
        return {
          position: 'absolute',
          top: 'initial'
        };
      }
    }
  };
}