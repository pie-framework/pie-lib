import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

export class SettingsBox extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };

  static defaultProps = {};

  render() {
    const { classes, className, children } = this.props;

    return <div className={classNames(classes.settingsBox, className)}>{children}</div>;
  }
}
const styles = (theme) => ({
  settingsBox: {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.grey[200]}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: '275px',
    maxWidth: '300px',
    padding: '20px 4px 4px 20px',
    zIndex: 99,
  },
});

export default withStyles(styles)(SettingsBox);
