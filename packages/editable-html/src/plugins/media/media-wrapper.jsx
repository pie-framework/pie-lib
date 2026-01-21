import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';

const StyledMediaWrapper = styled('span')(() => ({
  position: 'relative',
  '&.editor': {
    display: 'inline-block',
    overflow: 'hidden',
  },
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
      <StyledMediaWrapper
        className={classNames({
          editor: editor,
        })}
        {...rest}
        style={{
          width: width || 300,
        }}
      >
        {children}
      </StyledMediaWrapper>
    );
  }
}

export default MediaWrapper;
