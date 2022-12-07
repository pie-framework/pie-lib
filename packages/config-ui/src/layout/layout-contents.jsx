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
    classes: PropTypes.object,
  };

  render() {
    const { mode, secondary, children, classes } = this.props;
    // in config-layout, layout content gets called like this:
    // <LayoutContents secondary={layoutMode === 'inline' ? <SettingsBox>{settings}</SettingsBox> : settings}>
    const configuration =
      secondary?.props?.configuration || secondary?.props?.children?.props?.configuration || undefined;
    const hasSettingsPanel = Object.entries(configuration || {}).some(([propName, obj]) => !!obj?.settings);

    return (
      <div className={classnames(classes.container)}>
        {mode === 'inline' && (
          <div className={classes.flow}>
            <div className={classes.configContainer}>{children}</div>
            {hasSettingsPanel && <div>{secondary}</div>}
          </div>
        )}
        {mode === 'tabbed' && hasSettingsPanel && (
          <Tabs onChange={this.onTabsChange} contentClassName={classes.contentContainer} indicatorColor="primary">
            <div title="Design">{children}</div>
            <div title="settings">{secondary}</div>
          </Tabs>
        )}
        {mode === 'tabbed' && !hasSettingsPanel && <div>{children}</div>}
      </div>
    );
  }
}

const styles = () => ({
  flow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  contentContainer: {
    padding: '32px 16px 0 16px',
  },
  configContainer: {
    flex: '1',
    marginRight: '20px',
  },
});

export default withStyles(styles)(RawLayoutContents);
