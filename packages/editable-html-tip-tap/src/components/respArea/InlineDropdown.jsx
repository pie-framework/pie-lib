import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NodeViewWrapper } from '@tiptap/react';
import { Chevron } from '../icons/RespArea';
import ReactDOM from 'react-dom';

const InlineDropdown = (props) => {
  const { editor, node, getPos, options, selected } = props;
  const { attrs: attributes } = node;
  const { value, error } = attributes;
  // TODO: Investigate
  // Needed because items with values inside have different positioning for some reason
  const html = value || '<div>&nbsp</div>';
  const pos = getPos();
  const toolbarRef = useRef(null);
  const toolbarEditor = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const InlineDropdownToolbar = options.respAreaToolbar([node, pos], editor, () => {});

  useEffect(() => {
    const { selection } = editor.state;
    const onlyThisNodeSelected = selection.from + node.nodeSize === selection.to;

    if (selected) {
      if (onlyThisNodeSelected) {
        setShowToolbar(selected);
      }
    } else {
      setShowToolbar(selected);
    }
  }, [editor, node, selected]);

  useEffect(() => {
    // Calculate position relative to selection
    const bodyRect = document.body.getBoundingClientRect();
    const { from } = editor.state.selection;
    const start = editor.view.coordsAtPos(from);

    setPosition({
      top: start.top + Math.abs(bodyRect.top) + 40, // shift above
      left: start.left,
    });

    const handleClickOutside = (event) => {
      const insideSomeEditor = event.target.closest('[data-toolbar-for]');

      if (
        (!insideSomeEditor || insideSomeEditor.dataset.toolbarFor !== toolbarEditor.current.instanceId) &&
        !editor._toolbarOpened &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target) &&
        !event.target.closest('[data-inline-node]')
      ) {
        setShowToolbar(false);
      }
    };

    if (showToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showToolbar]);

  return (
    <NodeViewWrapper
      className="inline-dropdown"
      data-selected={selected}
      style={{
        display: 'inline-flex',
        height: '50px',
        margin: '0 5px',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          minWidth: '178px',
          height: '36px',
          background: '#FFF',
          border: '1px solid #C0C3CF',
          boxSizing: 'border-box',
          borderRadius: '3px',
          margin: '0 4px',
          position: 'relative',
          alignItems: 'center',
        }}
        onClick={() => setShowToolbar(true)}
      >
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: '0 25px 0 8px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        </div>
        <Chevron
          direction="down"
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
          }}
        />
      </div>
      {showToolbar &&
        ReactDOM.createPortal(
          <div ref={toolbarRef} style={{ zIndex: 1 }}>
            <InlineDropdownToolbar
              editorCallback={(instance) => {
                toolbarEditor.current = instance;
              }}
            />
          </div>,
          document.body,
        )}
    </NodeViewWrapper>
  );
};

InlineDropdown.propTypes = {
  attributes: PropTypes.object,
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default InlineDropdown;
