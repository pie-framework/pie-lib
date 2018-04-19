import { withStyles } from 'material-ui/styles';
import React from 'react';

class Root extends React.Component {
  render() {
    const { children, classes } = this.props;
    return (
      <div className={classes.root}>
        <div>hi</div>
        <div className={classes.children}>{children}</div>
      </div>
    );
  }
}

const styles = {
  root: {
    backgroundColor: 'pink'
  },
  children: {
    border: 'solid 1px red'
  }
};
export default withStyles(styles)(Root);
