import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledWrapper = styled('span', {
  shouldForwardProp: (prop) => prop !== 'editor',
})(({ editor }) => ({
  position: 'relative',
  ...(editor && {
    display: 'inline-block',
    overflow: 'hidden',
  }),
}));

class MediaWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.array,
    editor: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  render() {
    const { editor, children, width, ...rest } = this.props;

    return (
      <StyledWrapper
        editor={editor}
        {...rest}
        style={{
          width: width || 300,
        }}
      >
        {children}
      </StyledWrapper>
    );
  }
}

export default MediaWrapper;
