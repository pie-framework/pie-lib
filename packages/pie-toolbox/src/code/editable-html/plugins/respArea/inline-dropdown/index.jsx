import React from 'react';
import PropTypes from 'prop-types';
import { Chevron } from '../icons';

const InlineDropdown = ({ attributes, children, selectedItem }) => {
  // Needed because items with values inside have different positioning for some reason
  const html = selectedItem || '<div>&nbsp</div>';

  return (
    <span
      {...attributes}
      contentEditable={false}
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
          position: 'relative',
        }}
      >
        {children}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            padding: '0 25px 0 8px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: '35px',
          }}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
        <Chevron
          direction="down"
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
          }}
        />
      </div>
    </span>
  );
};

InlineDropdown.propTypes = {
  attributes: PropTypes.object,
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default InlineDropdown;
