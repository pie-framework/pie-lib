import React from 'react';
import { styled } from '@mui/material/styles';

const StyledCssIcon = styled('div')(({ theme }) => ({
  fontFamily: 'Cerebri Sans, Arial, sans-serif',
  fontSize: theme.typography.fontSize,
  fontWeight: 'bold',
  lineHeight: '14px',
  position: 'relative',
  whiteSpace: 'nowrap',
}));

const CssIcon = () => <StyledCssIcon>CSS</StyledCssIcon>;

export default CssIcon;
