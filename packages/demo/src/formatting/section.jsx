import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Section = withStyles({
  section: {
    padding: '20px',
    paddingTop: '40px',
    paddingBottom: '40px',
    position: 'relative',
    '&::after': {
      display: 'block',
      position: 'absolute',
      left: '0',
      top: '0',
      bottom: '0',
      right: '0',
      height: '2px',
      content: '""',
      backgroundColor: 'rgba(0,0,0,0.2)'
    }
  }
})(({ name, children, classes }) => (
  <div className={classes.section}>
    <Typography>{name}</Typography>
    <br />
    {children}
  </div>
));

export default Section;
