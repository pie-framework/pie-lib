import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const Box = withStyles(theme => ({
  box: {
    padding: 0
  },
  separator: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    border: 0,
    borderTop: '1px solid #eeeeee'
  }
}))(({ classes, children }) => (
  <div className={classes.box}>
    {children}
    <hr className={classes.separator} />
  </div>
));

export default Box;
