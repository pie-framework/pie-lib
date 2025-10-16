import { styled } from '@mui/material/styles';
import React from 'react';

import withRoot from '../source/withRoot';
import Typography from '@mui/material/Typography';

const StyledTypography = styled(Typography)({
  backgroundColor: 'blue',
});

const D = () => <StyledTypography variant={'h6'}>Welcome to the @pie-libs demo</StyledTypography>;

export default withRoot(D);
