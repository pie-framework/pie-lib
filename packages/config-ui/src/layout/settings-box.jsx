import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
export class SettingsBox extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
  };
  static defaultProps = {};
  render() {
    const { classes, className, children } = this.props;
    return <div className={classNames(classes.settingsBox, className)}>{children}</div>;
  }
}
const styles = () => ({
  settingsBox: {
    backgroundColor: '#FFF',
    border: '2px solid #EEE',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: '275px',
    maxWidth: '300px',
    padding: '24px 8px 24px 24px',
    width: '80%',
    zIndex: 99
  }
});
export default withStyles(styles)(SettingsBox);
