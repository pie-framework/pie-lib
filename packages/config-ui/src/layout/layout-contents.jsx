import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Tabs from '../tabs';
import classNames from 'classnames';

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));

const StyledFlow = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const StyledContentContainer = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(2)}px 0`,
}));

const StyledConfigContainer = styled('div')(() => ({
  flex: '1',
}));

const StyledSettingsContainer = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

class RawLayoutContents extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['tabbed', 'inline']),
    secondary: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    dimensions: PropTypes.object,
  };

  getConfiguration = () => {
    const { secondary } = this.props;
    // in config-layout, secondary can be: <SettingsBox>{settings}</SettingsBox>, settings, null

    return secondary?.props?.configuration || secondary?.props?.children?.props?.configuration || undefined;
  };

  // // eslint-disable-next-line no-unused-vars
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const configuration = this.getConfiguration();
  //   const { mode } = this.props;
  //
  //   // promptHolder class is used to wrap up inputs:
  //   // we don't want inputs to fill the entire scrollable container,
  //   // but instead we want inputs to fit in the first view,
  //   // so we calculate the maximum space inputs need
  //   try {
  //     if (
  //       configuration?.maxWidth &&
  //       getComputedStyle(document.documentElement).getPropertyValue('--pie-prompt-holder-max-width') !==
  //         configuration?.maxWidth
  //     ) {
  //       document.documentElement.style.setProperty(
  //         '--pie-prompt-holder-max-width',
  //         mode === 'inline' ? `calc(${configuration.maxWidth} - 340px)` : configuration.maxWidth,
  //       );
  //     }
  //   } catch (e) {
  //     console.log(e.toString());
  //   }
  // }

  render() {
    const { mode, secondary, children, dimensions } = this.props;
    const { minHeight, minWidth, maxHeight, maxWidth } = dimensions || {};
    const configuration = this.getConfiguration();

    let hasSettingsPanel = Object.entries(configuration || {}).some(([, obj]) => !!obj?.settings);
    // ebsr has configuration.partA and configuration.partB
    // because we might have nested configuration for other item types as well, let's add this simple regex to check values for settings

    if (!hasSettingsPanel) {
      try {
        hasSettingsPanel = JSON.stringify(configuration)?.match(/settings":true/)?.length;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.toString());
      }
    }

    return (
      <StyledContainer style={{ minHeight, minWidth, maxHeight, maxWidth }}>
        {mode === 'inline' && (
          <StyledFlow>
            <StyledConfigContainer className="design-container">{children}</StyledConfigContainer>
            {hasSettingsPanel && (
              <StyledSettingsContainer className="settings-container">{secondary}</StyledSettingsContainer>
            )}
          </StyledFlow>
        )}

        {mode === 'tabbed' && hasSettingsPanel && (
          <Tabs onChange={this.onTabsChange} contentClassName="content-container" indicatorColor="primary">
            <div title="Design" className="design-container">
              {children}
            </div>
            <div title="Settings" className="settings-container">
              {secondary}
            </div>
          </Tabs>
        )}

        {mode === 'tabbed' && !hasSettingsPanel && (
          <StyledContentContainer className="design-container">{children}</StyledContentContainer>
        )}
      </StyledContainer>
    );
  }
}

export default RawLayoutContents;
