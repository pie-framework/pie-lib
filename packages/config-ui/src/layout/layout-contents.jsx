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

  getConfiguration = () => {
    const { secondary } = this.props;
    // in config-layout, layout content gets called like this:
    // <LayoutContents secondary={layoutMode === 'inline' ? <SettingsBox>{settings}</SettingsBox> : settings}>

    return secondary?.props?.configuration || secondary?.props?.children?.props?.configuration || undefined;
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const configuration = this.getConfiguration();
    const { mode } = this.props;

    // promptHolder class is used to wrap up inputs:
    // we don't want inputs to fill the entire scrollable container,
    // but instead we want inputs to fit in the first view,
    // so we calculate the maximum space inputs need
    try {
      if (
        configuration?.maxWidth &&
        getComputedStyle(document.documentElement).getPropertyValue('--pie-prompt-holder-max-width') !==
          configuration?.maxWidth
      ) {
        document.documentElement.style.setProperty(
          '--pie-prompt-holder-max-width',
          mode === 'inline' ? `calc(${configuration.maxWidth} - 340px)` : configuration.maxWidth,
        );
      }
    } catch (e) {
      console.log(e.toString());
    }
  }

  render() {
    const { mode, secondary, children, classes } = this.props;
    const configuration = this.getConfiguration();

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
          <div className={classes.flow} style={{ maxWidth: configuration?.maxWidth || 'unset' }}>
            <div
              className={classnames(
                classes.configContainer,
                configuration?.maxWidth && classes.contentContainerMaxWidth,
              )}
              style={configuration?.maxWidth ? { maxWidth: `calc(${configuration?.maxWidth} - 330px)` } : {}}
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
              configuration?.maxWidth && classes.contentContainerMaxWidth,
            )}
            contentStyle={configuration?.maxWidth ? { maxWidth: configuration?.maxWidth } : {}}
            indicatorColor="primary"
          >
            <div title="Design" style={configuration?.maxWidth ? { flex: 1 } : {}}>
              {children}
            </div>
            <div title="settings">{secondary}</div>
          </Tabs>
        )}
        {mode === 'tabbed' && !hasSettingsPanel && (
          <div
            className={classnames(configuration?.maxWidth && classes.contentContainerMaxWidth)}
            style={configuration?.maxWidth ? { maxWidth: configuration?.maxWidth } : {}}
          >
            {children}
          </div>
        )}
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
});

export default withStyles(styles)(RawLayoutContents);
