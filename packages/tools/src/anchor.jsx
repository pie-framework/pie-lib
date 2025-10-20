import React from 'react';
import { styled } from '@mui/material/styles';

const StyledAnchor = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  width: '20px',
  height: '20px',
  position: 'absolute',
  borderRadius: '10px',
  backgroundColor: `var(--ruler-bg, ${theme.palette.primary.contrastText})`,
  transition: 'background-color 200ms ease-in',
  border: `solid 1px var(--ruler-stroke, ${theme.palette.primary.dark})`,
  '&:hover': {
    backgroundColor: `var(--ruler-bg-hover, ${theme.palette.primary.light})`,
  },
}));

const Anchor = ({ className, ...props }) => <StyledAnchor className={className} {...props} />;

export default Anchor;
