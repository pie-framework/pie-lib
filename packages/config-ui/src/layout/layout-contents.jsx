import React from 'react';
import { withStyles } from '@material-ui/core';
import Tabs from '../tabs';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class RawLayoutContents extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['tabbed', 'inline']),
    secondary: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    classes: PropTypes.object
  };

  render() {
    const { mode, secondary, children, classes } = this.props;

    return (
      <div className={classnames(classes.container)}>
        {mode === 'inline' && (
          <div className={classes.flow}>
            <div className={classes.configContainer}>{children}</div>
            <div>{secondary}</div>
          </div>
        )}
        {mode === 'tabbed' && (
          <Tabs
            onChange={this.onTabsChange}
            contentClassName={classes.contentContainer}
            indicatorColor="primary"
          >
            <div title="Design">{children}</div>
            <div title="settings">{secondary}</div>
          </Tabs>
        )}
      </div>
    );
  }
}

const styles = () => ({
  flow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  contentContainer: {
    padding: '32px 16px 0 16px'
  },
  configContainer: {
    flex: '1',
    marginRight: '20px'
  }
});

export default withStyles(styles)(RawLayoutContents);
