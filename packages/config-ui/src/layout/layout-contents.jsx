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
    let hasSettingsPanel = Object.entries(configuration || {}).some(([propName, obj]) => !!obj?.settings);
    // ebsr has configuration.partA and configuration.partB
    // because we might have nested configuration for other item types as well, let's add this simple regex to check values for settings

    if (!hasSettingsPanel) {
      try {
        hasSettingsPanel = JSON.stringify(configuration).match(/settings":true/).length;
      } catch (e) {
        console.log(e.toString());
      }
    }

    return (
      <div className={classnames(classes.container)}>
        {mode === 'inline' && (
          <div className={classes.flow} style={{ maxWidth: configuration.maxWidth || 'unset' }}>
            <div
              className={classnames(
                classes.configContainer,
                configuration.maxWidth && classes.contentContainerMaxWidth,
              )}
              style={{ maxWidth: configuration.maxWidth ? `calc(${configuration.maxWidth} - 330px)` : 'unset' }}
            >
              {children}
            </div>
            {hasSettingsPanel && <div>{secondary}</div>}
          </div>
        )}
        {mode === 'tabbed' && hasSettingsPanel && (
          <Tabs
            onChange={this.onTabsChange}
            contentClassName={classnames(
              classes.contentContainer,
              configuration.maxWidth && classes.contentContainerMaxWidth,
            )}
            contentStyle={{ maxWidth: configuration.maxWidth || 'unset' }}
            indicatorColor="primary"
          >
            <div className={classes.contentContainerDesign} title="Design">
              {children}
            </div>
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
  contentContainerMaxWidth: {
    display: 'flex',
    overflow: 'scroll',
  },
  configContainer: {
    flex: '1',
    marginRight: '20px',
  },
  contentContainerDesign: {
    width: '100%',
  },
});

export default withStyles(styles)(RawLayoutContents);
