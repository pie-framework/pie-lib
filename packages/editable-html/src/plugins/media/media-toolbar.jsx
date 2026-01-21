import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledMediaToolbar = styled('span')(({ theme }) => ({
  position: 'relative',
  bottom: '5px',
  left: 0,
  width: '100%',
  background: theme.palette.common.white,
  display: 'inline-flex',
  padding: '5px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
}));

const StyledEditContainer = styled('span')(({ theme }) => ({
  cursor: 'pointer',
  flex: 3,
  border: `solid ${theme.palette.common.black}`,
  textAlign: 'right',
  borderWidth: '0 2px 0 0',
  marginRight: '5px',
  paddingRight: '5px',
}));

const StyledRemoveContainer = styled('span')(() => ({
  cursor: 'pointer',
}));

class MediaToolbar extends React.Component {
  static propTypes = {
    onEdit: PropTypes.func,
    hideEdit: PropTypes.bool,
    onRemove: PropTypes.func,
  };

  render() {
    const { hideEdit, onEdit, onRemove } = this.props;

    return (
      <StyledMediaToolbar>
        {hideEdit ? null : (
          <StyledEditContainer onClick={onEdit}>
            Edit Settings
          </StyledEditContainer>
        )}
        <StyledRemoveContainer onClick={onRemove}>
          Remove
        </StyledRemoveContainer>
      </StyledMediaToolbar>
    );
  }
}

export default MediaToolbar;
