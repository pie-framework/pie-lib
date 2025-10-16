import React from 'react';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';

const Section = withStyles((theme) => ({
  section: {
    padding: '0px',
    paddingTop: '40px',
    paddingBottom: '40px',
    position: 'relative',
  },
  header: {
    position: 'relative',
    paddingBottom: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
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
  },
}))(({ name, children, classes }) => (
  <div className={classes.section}>
    <Typography variant="h5" className={classes.header}>
      {name}
    </Typography>
    {children}
  </div>
));

export default Section;
