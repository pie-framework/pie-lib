import React from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash-es';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const comp = (variant, styles = {}) => {
  const StyledTypography = styled(Typography)(({ theme }) => {
    const resolvedStyles = isFunction(styles) ? styles(theme) : styles;
    return {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      ...resolvedStyles,
    };
  });

  const Component = ({ children }) => (
    <StyledTypography variant={variant}>
      {children}
    </StyledTypography>
  );

  Component.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };

  return Component;
};

export const Body = comp('body1', { paddingTop: '0px' });
export const Header = comp('h4'); // Changed from 'title' to 'h4' as 'title' is deprecated in MUI v5
