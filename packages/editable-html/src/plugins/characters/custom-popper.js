import React from 'react';
import { styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

const StyledPopper = styled(Popper)(() => ({
  background: '#fff',
  padding: '10px',
  pointerEvents: 'none',
  zIndex: 99999,
  '& .MuiPaper-root': {
    padding: 20,
    height: 'auto',
    width: 'auto',
  },
}));

const StyledTypography = styled(Typography)(() => ({
  fontSize: 50,
  textAlign: 'center',
}));

const CustomPopper = ({ children, ...props }) => (
  <StyledPopper
    id="mouse-over-popover"
    open
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    disableRestoreFocus
    disableAutoFocus
    {...props}
  >
    <StyledTypography>{children}</StyledTypography>
  </StyledPopper>
);

export default CustomPopper;
