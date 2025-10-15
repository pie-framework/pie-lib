import React, { useEffect, useState, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import PropTypes from 'prop-types';

const ExplicitConstructedResponse = (props) => {
  // const { attributes, value, error } = props;
  const { editor, node, getPos, options, selected, responseAreaProps } = props;
  const { attrs: attributes } = node;
  const { value, error } = attributes;
  const pos = getPos();
  const [showToolbar, setShowToolbar] = useState(false);
  const EcrToolbar = options.respAreaToolbar(node, editor, () => {});
  const toolbarRef = useRef(null);

  const handleDone = (newLatex) => {
    updateAttributes({ latex: newLatex });
    setShowToolbar(false);
    editor.commands.focus();
  };

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
      className="drag-in-the-blank"
      data-selected={selected}
      style={{
        display: 'inline-flex',
        minHeight: '55px',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div
        {...attributes}
        style={{
          display: 'inline-flex',
          width: '100%',
          minHeight: '46px',
          height: '46px',
          backgroundColor: '#FFF',
          border: `1px solid ${error ? 'red' : '#C0C3CF'}`,
          boxSizing: 'border-box',
          borderRadius: '4px',
          overflow: 'hidden',
          padding: '12px 21px',
          marginLeft: '4px',
          visibility: showToolbar ? 'hidden' : 'visible',
        }}
        onClick={() => setShowToolbar(true)}
        dangerouslySetInnerHTML={{
          __html: value || '<div>&nbsp;</div>',
        }}
      />
      {showToolbar && (
        <div ref={toolbarRef} className="absolute z-50 bg-white shadow-lg rounded p-2">
          <EcrToolbar />
        </div>
      )}
    </NodeViewWrapper>
  );
};

ExplicitConstructedResponse.propTypes = {
  attributes: PropTypes.object,
  error: PropTypes.any,
  value: PropTypes.string,
  isFocused: PropTypes.bool,
};

export default ExplicitConstructedResponse;
