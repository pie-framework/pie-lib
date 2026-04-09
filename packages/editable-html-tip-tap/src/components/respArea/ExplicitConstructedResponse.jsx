import React, { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CustomToolbarWrapper from '../../extensions/custom-toolbar-wrapper';

const ExplicitConstructedResponse = (props) => {
  const { editor, node, getPos, options, selected } = props;
  const { attrs: attributes } = node;
  const { value } = attributes;
  const { respAreaToolbar, error: errorFn } = options;
  const pos = getPos();
  const [showToolbar, setShowToolbar] = useState(false);
  const EcrToolbar = respAreaToolbar([node, pos], editor, () => { });
  const toolbarRef = useRef(null);

  let error;

  if (errorFn) {
    const errorValue = errorFn();
    const respIndex = parseInt(attributes.index, 10);

    error = !!errorValue?.[respIndex]?.[0];
  }

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
    const handleClickOutside = (event) => {
      const insideCharacterPicker = event.target.closest('.insert-character-dialog') || event.target.closest('[data-toolbar-for]');

      if (
        !insideCharacterPicker &&
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
          margin: '0 4px',
          minWidth: '178px',
          visibility: showToolbar ? 'hidden' : 'visible',
        }}
        onClick={() => setShowToolbar(true)}
        dangerouslySetInnerHTML={{
          __html: value || '<div>&nbsp;</div>',
        }}
      />
      {showToolbar && (
        <div ref={toolbarRef} className="absolute z-50 bg-white shadow-lg rounded p-2" style={{ zIndex: 1 }}>
          <EcrToolbar />
        </div>
      )}
      {showToolbar && editor._tiptapContainerEl && ReactDOM.createPortal(
          <CustomToolbarWrapper
            deletable
            toolbarOpts={{ minWidth: 'auto' }}
            autoWidth
            style={{ top: -40, left: 0, right: 0 }}
            onDelete={() => {
              const { tr } = editor.state;
              tr.delete(pos, pos + node.nodeSize);
              // Prevent the debounced onBlur/onDone from firing into the
              // now-deleted node's stale position
              editor._toolbarOpened = false;
              editor.view.dispatch(tr);
              setShowToolbar(false);
              editor.commands.focus();
            }}
            showDone={false}
          />,
        editor._tiptapContainerEl,
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
