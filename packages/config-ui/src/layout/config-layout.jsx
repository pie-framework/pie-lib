import React from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import classnames from 'classnames';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const Section = props => {
  const { classes, title, items } = props;

  return (
    items &&
    items.length > 0 && (
      <div className={classes.section}>
        {title && <h2>{title}</h2>}
        <div className={classes.sidePanelItems}>{items}</div>
      </div>
    )
  );
};

Section.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.node)
};

const Sections = props => {
  const { classes, sideMenuItems: sections } = props;

  return sections.map((section, index) => (
    <Section
      key={index}
      classes={classes}
      title={section.title}
      items={section.items}
    />
  ));
};

Sections.propTypes = {
  classes: PropTypes.object.isRequired,
  sideMenuItems: PropTypes.array.isRequired
};

class SidePanel extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    sideMenuItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.node)
      })
    )
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.sidePanel}>
        <div className={classes.sections}>
          <Sections {...this.props} />
        </div>
      </div>
    );
  }
}

class ConfigLayout extends React.Component {
  static propTypes = {
    sidePanelSelector: PropTypes.string,
    disableSidePanel: PropTypes.bool,
    sideMenuItems: PropTypes.array,
    scoringItem: PropTypes.node,
    regularItems: PropTypes.node,
    regularOnly: PropTypes.bool,
    inTabForSure: PropTypes.bool,
    className: PropTypes.string,
    classes: PropTypes.object
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

  hasSidePanel = () => this.state.dimensions.width >= 100;

  renderSidePanel = () => {
    const { sidePanelSelector } = this.props;
    const elementFound = document.querySelector(sidePanelSelector);

    if (sidePanelSelector) {
      if (elementFound) {
        const el = React.createElement(SidePanel, this.props);

        ReactDOM.render(el, document.querySelector(sidePanelSelector));
      }

      return null;
    }

    return <SidePanel {...this.props} />;
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

  renderContent = measureRef => {
    const { classes, regularItems, scoringItem, disableSidePanel, regularOnly, inTabForSure } = this.props;
    const { index } = this.state;
    const hasSidePanel = this.hasSidePanel();

    if (regularOnly) {
      return regularItems;
    }

    return (
      <div
        ref={measureRef}
      >
        {!inTabForSure && hasSidePanel && !disableSidePanel && this.renderSidePanel()}
        {(inTabForSure || (!hasSidePanel && !disableSidePanel)) && (
          <Sections {...this.props} />
        )}
      </div>
    );

    return (
      <div
        ref={measureRef}
        className={classnames(classes.container, {
          [classes.hasSidePanel]: hasSidePanel
        })}
      >
        <Tabs
          onChange={this.onTabsChange}
          value={index}
          indicatorColor="primary"
        >
          <Tab label="Design" />
          {this.shouldRenderSettingsTab() && <Tab label="Settings" />}
          {scoringItem && <Tab label="Scoring" />}
        </Tabs>
        <div className={classes.contentContainer}>
          {disableSidePanel && <Sections {...this.props} />}
          {index === 0 && regularItems}
          {!hasSidePanel && index === 1 && !disableSidePanel && (
            <Sections {...this.props} />
          )}
          {((!hasSidePanel && index === 2) || index === 1) && scoringItem}
          {hasSidePanel && !disableSidePanel && this.renderSidePanel()}
        </div>
      </div>
    );
  };

  render() {
    return (
      <Measure
        bounds
        onResize={contentRect => {
          const tabIndex = this.getRightIndex();

          this.setState({ index: tabIndex, dimensions: contentRect.bounds });
        }}
      >
        {({ measureRef }) => this.renderContent(measureRef)}
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
  section: {
    display: 'flex',
    flexDirection: 'column'
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    opacity: 1
  },
  closedSections: {
    opacity: 0
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
    useNextVariants: true,
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
      },
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
