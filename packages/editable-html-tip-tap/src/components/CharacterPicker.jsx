import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { PureToolbar } from '@pie-lib/math-toolbar';

import CustomPopper from './characters/custom-popper';
import { spanishConfig, specialConfig } from './characters/characterUtils';

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
  if (!opts?.characters?.length) {
    return null;
  }

  const containerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [popover, setPopover] = useState(null);

  const configToUse = useMemo(() => {
    if (!opts) return spanishConfig;

    switch (true) {
      case opts.language === 'spanish':
        return spanishConfig;
      case opts.language === 'special':
        return specialConfig;
      default:
        return opts;
    }
  }, [opts]);

  const layoutForCharacters = useMemo(
    () =>
      configToUse.characters.reduce(
        (obj, arr) => {
          if (arr.length >= obj.columns) {
            obj.columns = arr.length;
          }

          return obj;
        },
        { rows: configToUse.characters.length, columns: 0 },
      ),
    [configToUse],
  );

  const closePopOver = () => setPopover(null);

  useEffect(
    () => () => {
      closePopOver();
    },
    [],
  );

  useEffect(() => {
    if (!editor) return;

    // Calculate position relative to selection
    const editorDOM = editor.options.element;
    const editorRect = editorDOM.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const { from } = editor.state.selection;
    const start = editor.view.coordsAtPos(from);

    let top = editorRect.top + Math.abs(bodyRect.top) + editorRect.height + 60;

    if (editorRect.y > containerRef.current.offsetHeight) {
      top = top - (containerRef.current.offsetHeight + editorRect.height) - 80;
    }

    setPosition({
      // top: start.top + Math.abs(bodyRect.top) - containerRef.current.offsetHeight - 10 + additionalTopOffset, // shift above
      top: top,
      left: start.left,
    });

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && !editor.view.dom.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editor, onClose]);

  const renderPopOver = (event, el) => setPopover({ anchorEl: event.currentTarget, el });

  const handleChange = (val) => {
    if (typeof val === 'string') {
      editor
        .chain()
        .focus()
        .insertContent(val)
        .run();
    }
  };

  return (
    <>
      {ReactDOM.createPortal(
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
                          actions: {
                            onMouseEnter: (ev) => renderPopOver(ev, k),
                            onMouseLeave: closePopOver,
                          },
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
      )}
      {popover &&
        ReactDOM.createPortal(
          <CustomPopper onClose={closePopOver} anchorEl={popover.anchorEl}>
            <div>{popover.el.label}</div>
            <div style={{ fontSize: 20, lineHeight: '20px' }}>{popover.el.description}</div>
            <div style={{ fontSize: 20, lineHeight: '20px' }}>{popover.el.unicode}</div>
          </CustomPopper>,
          document.body,
        )}
    </>
  );
}

CharacterPicker.propTypes = {
  editor: PropTypes.object,
  opts: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export { CharacterIcon };
