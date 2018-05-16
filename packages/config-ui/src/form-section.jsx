import React from 'react';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  formSection: {
    marginTop: '20px',
    marginBottom: '20px'
  },
  label: {
    marginBottom: '10px'
  }
};

export default withStyles(styles)(({ className, classes, label, children }) => (
  <div className={classNames(classes.formSection, className)}>
    <Typography className={classes.label} type="subheading">
      {label}
    </Typography>
    {children}
  </div>
));
