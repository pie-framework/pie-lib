import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const useStyles = withStyles(() => ({
  root: {
    position: 'relative'
  }
}));

class MediaWrapper extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    children: PropTypes.func
  };

  render() {
    const { classes, children, ...rest } = this.props;

    return (
      <span className={classes.root} {...rest}>
        {children}
      </span>
    );
  }
}

export default useStyles(MediaWrapper);
