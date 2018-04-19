import { withStyles } from 'material-ui/styles';
import React from 'react';

import withRoot from '../src/withRoot';
const D = ({ classes }) => (
  <div className={classes.root}>foo where is the container</div>
);

export default withRoot(
  withStyles({
    root: {
      backgroundColor: 'blue'
    }
  })(D)
);
