import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { NodeViewWrapper } from '@tiptap/react';
import { Chevron } from '../icons';

const InlineDropdown = (props) => {
  const { editor, node, getPos, options, selected } = props;
  const { attrs: attributes } = node;
  const { value, error } = attributes;
  // TODO: Investigate
  // Needed because items with values inside have different positioning for some reason
  const html = value || '<div>&nbsp</div>';
  const toolbarRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const InlineDropdownToolbar = options.respAreaToolbar(node, editor, () => {});

  useEffect(() => {
    setShowToolbar(selected);
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
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
      {showToolbar && (
        <div ref={toolbarRef} className="absolute z-50 bg-white shadow-lg rounded p-2" style={{ zIndex: 1 }}>
          <InlineDropdownToolbar />
        </div>
      )}
    </NodeViewWrapper>
  );
};

InlineDropdown.propTypes = {
  attributes: PropTypes.object,
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default InlineDropdown;
