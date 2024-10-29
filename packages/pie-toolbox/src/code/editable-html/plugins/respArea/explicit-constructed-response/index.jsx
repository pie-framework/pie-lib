import React from 'react';
import PropTypes from 'prop-types';

const ExplicitConstructedResponse = (props) => {
  const { attributes, value, error } = props;

  return (
    <span
      {...attributes}
      style={{
        display: 'inline-flex',
        minHeight: '50px',
        minWidth: '178px',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
            display: 'inline-flex',
            width: '100%',
            minHeight: '42px',
            height: '42px',
            backgroundColor: '#FFF',
            border: `1px solid ${error ? 'red' : '#C0C3CF'}`,
            boxSizing: 'border-box',
            borderRadius: '4px',
            overflow: 'hidden',
            padding: '10px 21px',
            marginLeft: '4px',
        }}
        dangerouslySetInnerHTML={{
          __html: value || '<div>&nbsp;</div>',
        }}
      />
    </span>
  );
};

ExplicitConstructedResponse.propTypes = {
  attributes: PropTypes.object,
  error: PropTypes.any,
  value: PropTypes.string,
};

export default ExplicitConstructedResponse;
