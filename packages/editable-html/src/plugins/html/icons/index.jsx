import React from 'react';
import { styled } from '@mui/material/styles';

const StyledHtmlIcon = styled('div')(({ theme }) => ({
  fontFamily: 'Cerebri Sans, Arial, sans-serif',
  fontSize: theme.typography.fontSize,
  fontWeight: 'bold',
  lineHeight: '14px',
  position: 'relative',
  whiteSpace: 'nowrap',
}));

const HtmlModeIcon = ({ isHtmlMode }) => (
  <StyledHtmlIcon>{isHtmlMode ? 'Exit <HTML> mode' : '<HTML>'}</StyledHtmlIcon>
);

export default HtmlModeIcon;
