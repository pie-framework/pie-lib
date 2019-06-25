import React from 'react';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  formSection: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  label: {
    marginBottom: theme.spacing.unit
  }
});

export default withStyles(styles)(({ className, classes, label, children }) => (
  <div className={classNames(classes.formSection, className)}>
    <Typography className={classes.label} type="subheading">
      {label}
    </Typography>
    {children}
  </div>
));
