import React from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import classnames from 'classnames';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LayoutContents from './layout-contents';
class SidePanel extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
    sideMenuItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.node)
      })
    )
  };

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.sidePanel}>
        <div className={classes.sections}>{children}</div>
      </div>
    );
  }
}

class ConfigLayout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
    sidePanelSelector: PropTypes.string,
    disableSidePanel: PropTypes.bool,
    settings: PropTypes.element,
    scoringItem: PropTypes.node,
    regularOnly: PropTypes.bool,
    inTabForSure: PropTypes.bool,
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
      value: 0,
      dimensions: {
        height: 500,
        width: 500
      },
      index: 0
    };
  }

  onTabsChange = (event, index) => this.setState({ index });

  hasSidePanel = () => this.state.dimensions.width >= this.props.sidePanelMinWidth;

  renderSidePanel = () => {
    const { sidePanelSelector, settings } = this.props;
    const elementFound = document.querySelector(sidePanelSelector);

    if (sidePanelSelector) {
      if (elementFound) {
        ReactDOM.render(settings, document.querySelector(sidePanelSelector));
      }

      return null;
    }

    return <SidePanel {...this.props}>{settings}</SidePanel>;
  };

  getRightIndex = () => {
    const { scoringItem } = this.props;
    const { index } = this.state;
    const settingsTab = this.shouldRenderSettingsTab() ? 1 : 0;
    const scoringTab = scoringItem ? 1 : 0;
    const tabsNumber = settingsTab + scoringTab;

    return index > tabsNumber ? tabsNumber : index;
  };

  shouldRenderSettingsTab = () => {
    const { disableSidePanel } = this.props;
    const hasSidePanel = this.hasSidePanel();

    return !disableSidePanel && !hasSidePanel;
  };

  // renderContent = measureRef => {
  //   const { children, classes, scoringItem, disableSidePanel, settings } = this.props;
  //   const { index } = this.state;
  //   const hasSidePanel = this.hasSidePanel();

  //   return (
  //     <div
  //       ref={measureRef}
  //       className={classnames(classes.container, {
  //         [classes.hasSidePanel]: hasSidePanel
  //       })}
  //     >
  //       <Tabs onChange={this.onTabsChange} value={index} indicatorColor="primary">
  //         <Tab label="Design" />
  //         {this.shouldRenderSettingsTab() && <Tab label="Settings" />}
  //         {scoringItem && <Tab label="Scoring" />}
  //       </Tabs>
  //       <div className={classes.contentContainer}>
  //         {/* {disableSidePanel && settings} */}
  //         {index === 0 && children}
  //         {!hasSidePanel && index === 1 && !disableSidePanel && settings}
  //         {/*
  //         {((!hasSidePanel && index === 2) || index === 1) && scoringItem}
  //         {hasSidePanel && !disableSidePanel && this.renderSidePanel()} */}
  //       </div>
  //     </div>
  //   );
  // };

  render() {
    return (
      <Measure
        bounds
        onResize={contentRect => {
          // const tabIndex = this.getRightIndex();
          this.setState({ dimensions: contentRect.bounds });
        }}
      >
        {({ measureRef }) => (
          <LayoutContents contentRef={measureRef} {...this.props} showSidePanel={true} />
        )}
      </Measure>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  contentContainer: {
    padding: '32px 16px 0 16px'
  },
  hasSidePanel: {
    paddingRight: 'calc(20% + 75px)'
  },
  sidePanel: {
    backgroundColor: '#FAFAFA',
    border: '2px solid #EEE',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: '200px',
    maxWidth: '250px',
    padding: '15px',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '20%',
    zIndex: 99
  },
  closedPanel: {
    top: -30,
    right: 10,
    backgroundColor: 'transparent',
    border: 'none',
    width: 0,
    height: 0
  },
  overlayPanel: {
    bottom: 0,
    left: 0,
    right: 0,
    top: '-30px',
    opacity: 1,
    transition: 'all 0.5s',
    width: 'auto'
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    opacity: 1
  },
  sidePanelItems: {
    display: 'flex',
    flexDirection: 'column'
  },
  sidePanelItemsArray: {
    marginBottom: '20px'
  }
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    action: {
      disabled: 'rgba(0, 0, 0, 0.54);'
    }
  },
  overrides: {
    MuiRadio: {
      root: {
        '&$checked': {
          color: '#3f51b5 !important'
        }
      }
    },
    MuiCheckbox: {
      root: {
        '&$checked': {
          color: '#3f51b5 !important'
        }
      }
    },
    MuiTabs: {
      root: {
        borderBottom: '1px solid #eee'
      }
    },
    MuiSwitch: {
      root: {
        '&$checked': {
          color: '#3f51b5 !important',
          '& + $bar': {
            backgroundColor: '#3f51b5 !important',
            opacity: 0.5
          }
        }
      }
    }
  }
});

const Styled = withStyles(styles)(ConfigLayout);

const RootElem = props => (
  <MuiThemeProvider theme={theme}>
    <Styled {...props} />
  </MuiThemeProvider>
);

export default RootElem;
