import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import grey from '@material-ui/core/colors/grey';

export class Choice extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };
  static defaultProps = {};
  render() {
    const { classes, className, children } = this.props;
    return (
      <div className={classNames(classes.choice, className)}>{children}</div>
    );
  }
}
const styles = theme => ({
  choice: {
    backgroundColor: 'white',
    border: `solid 1px ${grey[400]}`,
    padding: theme.spacing.unit
  }
});

export default withStyles(styles)(Choice);
