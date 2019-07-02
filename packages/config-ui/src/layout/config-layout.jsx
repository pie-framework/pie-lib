import React from 'react';
import Measure from 'react-measure';
import PropTypes from 'prop-types';
import LayoutContents from './layout-contents';
import SettingsBox from './settings-box';

class ConfigLayout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]),
    settings: PropTypes.element,
    className: PropTypes.string,
    classes: PropTypes.object,
    sidePanelMinWidth: PropTypes.number
  };

  static defaultProps = {
    sidePanelMinWidth: 950
  };

  constructor(props) {
    super(props);
    this.state = {
      layoutMode: undefined
    };
  }

  onResize = contentRect => {
    const { bounds } = contentRect;
    const { sidePanelMinWidth } = this.props;
    const layoutMode = bounds.width >= sidePanelMinWidth ? 'inline' : 'tabbed';

    this.setState({ layoutMode });
  };

  render() {
    return (
      <Measure bounds onResize={this.onResize}>
        {({ measureRef }) => {
          const { settings, children } = this.props;
          const { layoutMode } = this.state;

          return (
            <div ref={measureRef}>
              <LayoutContents
                mode={layoutMode}
                secondary={
                  layoutMode === 'inline' ? <SettingsBox>{settings}</SettingsBox> : settings
                }
              >
                {children}
              </LayoutContents>
            </div>
          );
        }}
      </Measure>
    );
  }
}

export default ConfigLayout;
