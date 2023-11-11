import React from 'react';
import Measure from 'react-measure';
import { withContentRect } from 'react-measure';
import PropTypes from 'prop-types';
import LayoutContents from './layout-contents';
import SettingsBox from './settings-box';

class MeasuredConfigLayout extends React.Component {
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
    sidePanelMinWidth: 950,
    hideSettings: false,
    dimensions: {},
  };

  constructor(props) {
    super(props);
    this.state = { layoutMode: undefined };
  }

  onResize = (contentRect) => {
    const { bounds } = contentRect;
    const { sidePanelMinWidth, dimensions } = this.props;
    const { maxWidth } = dimensions || {};

    const layoutMode =
      bounds.width >= sidePanelMinWidth && (maxWidth ? maxWidth >= sidePanelMinWidth : true) ? 'inline' : 'tabbed';

    this.setState({ layoutMode });
  };

  render() {
    return (
      <Measure bounds onResize={this.onResize}>
        {({ measureRef }) => {
          const { children, settings, hideSettings, dimensions } = this.props;
          const { layoutMode } = this.state;

          const settingsPanel =
            layoutMode === 'inline' ? <SettingsBox className="settings-box">{settings}</SettingsBox> : settings;
          const secondaryContent = hideSettings ? null : settingsPanel;

          return (
            <div ref={measureRef} className="main-container">
              <LayoutContents mode={layoutMode} secondary={secondaryContent} dimensions={dimensions}>
                {children}
              </LayoutContents>
            </div>
          );
        }}
      </Measure>
    );
  }
}

const ConfigLayout = withContentRect('bounds')(MeasuredConfigLayout);

export default ConfigLayout;
