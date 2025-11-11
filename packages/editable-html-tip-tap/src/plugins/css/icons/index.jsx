import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  icon: {
    fontFamily: 'Cerebri Sans, Arial, sans-serif',
    fontSize: theme.typography.fontSize,
    fontWeight: 'bold',
    lineHeight: '14px',
    position: 'relative',
    whiteSpace: 'nowrap',
  },
});

const CssIcon = ({ classes }) => <div className={classes.icon}>CSS</div>;

export default withStyles(styles)(CssIcon);
