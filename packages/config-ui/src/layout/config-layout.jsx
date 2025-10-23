import React from 'react';
import Measure from 'react-measure';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { withContentRect } from 'react-measure';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LayoutContents from './layout-contents';
import SettingsBox from './settings-box';
import { AppendCSSRules } from '@pie-lib/render-ui';

const theme = createTheme({
  typography: {
    fontFamily: 'inherit',
  },
});

class MeasuredConfigLayout extends AppendCSSRules {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
    className: PropTypes.string,
    dimensions: PropTypes.object,
    settings: PropTypes.element,
    sidePanelMinWidth: PropTypes.number,
    hideSettings: PropTypes.bool,
  };

  static defaultProps = {
    sidePanelMinWidth: 1135,
    hideSettings: false,
    dimensions: {},
  };

  constructor(...props) {
    super(...props);
    this.state = { layoutMode: undefined };
  }

  onResize = (contentRect) => {
    const { bounds } = contentRect;
    const { sidePanelMinWidth, dimensions } = this.props;
    const { maxWidth } = dimensions || {};

    const layoutMode =
      bounds.width > sidePanelMinWidth && (maxWidth ? maxWidth > sidePanelMinWidth : true) ? 'inline' : 'tabbed';

    this.setState({ layoutMode });
  };

  render() {
    return (
      <StyledEngineProvider injectFirst>(<ThemeProvider theme={theme}>
            <Measure bounds onResize={this.onResize}>
              {({ measureRef }) => {
                const { children, settings, hideSettings, dimensions } = this.props;
                const { layoutMode } = this.state;

                const settingsPanel =
                  layoutMode === 'inline' ? <SettingsBox className="settings-box">{settings}</SettingsBox> : settings;
                const secondaryContent = hideSettings ? null : settingsPanel;
                const finalClass = classNames('main-container');

                return (
                  <div ref={measureRef} className={finalClass}>
                    <LayoutContents mode={layoutMode} secondary={secondaryContent} dimensions={dimensions}>
                      {children}
                    </LayoutContents>
                  </div>
                );
              }}
            </Measure>
          </ThemeProvider>)
              </StyledEngineProvider>
    );
  }
}

const ConfigLayout = withContentRect('bounds')(MeasuredConfigLayout);

export default ConfigLayout;
