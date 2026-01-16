import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const SectionContainer = styled('div')({
  padding: '0px',
  paddingTop: '40px',
  paddingBottom: '40px',
  position: 'relative',
});

const SectionHeader = styled(Typography)(({ theme }) => ({
  position: 'relative',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&::after': {
    display: 'block',
    position: 'absolute',
    left: '0',
    bottom: '0',
    right: '0',
    height: '1px',
    content: '""',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
}));

const Section = ({ name, children }) => (
  <SectionContainer>
    <SectionHeader variant="h5">
      {name}
    </SectionHeader>
    {children}
  </SectionContainer>
);

export default Section;
