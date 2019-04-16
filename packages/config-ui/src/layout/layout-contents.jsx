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
        <Tabs
          onChange={this.onTabsChange}
          contentClassName={classes.contentContainer}
          indicatorColor="primary"
        >
          <div title="Design">
            {mode === 'inline' ? (
              <div className={classes.flow}>
                {children}
                <div>{secondary}</div>
              </div>
            ) : (
              children
            )}
          </div>
          {mode === 'tabbed' && <div title="settings">{secondary}</div>}
        </Tabs>
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
  }
});

export default withStyles(styles)(RawLayoutContents);
