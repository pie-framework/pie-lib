import React from 'react';
import Measure from 'react-measure';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { withContentRect } from 'react-measure';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LayoutContents from './layout-contents';
import SettingsBox from './settings-box';
import AppendCSSRules from '../../render-ui/append-css-rules';

const styles = {
  extraCSSRules: {},
};

const theme = createMuiTheme({
  typography: {
    // In MUI v3, this opts into the h1–h6 variants; otherwise use display1/headline/etc.
    useNextVariants: true,
    fontFamily: 'inherit',
  },
});

class MeasuredConfigLayout extends AppendCSSRules {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
    className: PropTypes.string,
    classes: PropTypes.object,
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
      <MuiThemeProvider theme={theme}>
        <Measure bounds onResize={this.onResize}>
          {({ measureRef }) => {
            const { children, settings, hideSettings, dimensions, classes } = this.props;
            const { layoutMode } = this.state;

            const settingsPanel =
              layoutMode === 'inline' ? <SettingsBox className="settings-box">{settings}</SettingsBox> : settings;
            const secondaryContent = hideSettings ? null : settingsPanel;
            const finalClass = classNames('main-container', classes.extraCSSRules);

            return (
              <div ref={measureRef} className={finalClass}>
                <LayoutContents mode={layoutMode} secondary={secondaryContent} dimensions={dimensions}>
                  {children}
                </LayoutContents>
              </div>
            );
          }}
        </Measure>
      </MuiThemeProvider>
    );
  }
}

const ConfigLayout = withStyles(styles)(withContentRect('bounds')(MeasuredConfigLayout));

export default ConfigLayout;
