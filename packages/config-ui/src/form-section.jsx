import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledFormSection = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const FormSection = ({ className, label, children, labelExtraStyle }) => (
  <StyledFormSection className={className}>
    <StyledTypography variant="subtitle1" style={labelExtraStyle}>
      {label}
    </StyledTypography>
    {children}
  </StyledFormSection>
);

export default FormSection;
