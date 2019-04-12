import React from 'react';
import { withStyles } from '@material-ui/core';
import Tabs from '../tabs';
import classnames from 'classnames';

{
  /* <Tab label="Design" />
          {this.shouldRenderSettingsTab() && <Tab label="Settings" />}
          {scoringItem && <Tab label="Scoring" />}
        </Tabs>
        <div className={classes.contentContainer}>
          {/* {disableSidePanel && settings} */
}
// {index === 0 && children}
// {!hasSidePanel && index === 1 && !disableSidePanel && settings}
{
  /*
          {((!hasSidePanel && index === 2) || index === 1) && scoringItem}
          {hasSidePanel && !disableSidePanel && this.renderSidePanel()} */
}
// </div> */}
class RawLayoutContents extends React.Component {
  render() {
    const {
      showSidePanel,
      contentRef,
      children,
      classes,
      scoringItem,
      disableSidePanel,
      settings
    } = this.props;
    // const { index } = this.state;
    // const hasSidePanel = this.hasSidePanel();
    console.log('children', children);
    return (
      <div
        ref={contentRef}
        className={classnames(classes.container, {
          // [classes.hasSidePanel]: hasSidePanel
        })}
      >
        <Tabs onChange={this.onTabsChange} indicatorColor="primary">
          <div title="foo">
            {showSidePanel ? (
              <div className={classes.flow}>
                {children}
                <div title="settings">settings</div>
              </div>
            ) : (
              children
            )}
          </div>
          <div title="bar">bar</div>
          {!showSidePanel && <div title="settings">settings</div>}
        </Tabs>
      </div>
    );
  }
}

const styles = () => ({
  flow: {
    display: 'flex'
  },
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

export default withStyles(styles)(RawLayoutContents);
