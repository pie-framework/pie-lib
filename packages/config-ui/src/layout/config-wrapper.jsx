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

class OutsideConfigLayout extends React.Component {
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
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minWidth: '200px',
    padding: '15px',
    width: '100%',
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

const Styled = withStyles(styles)(OutsideConfigLayout);

const RootElem = props => (
  <MuiThemeProvider theme={theme}>
    <Styled {...props} />
  </MuiThemeProvider>
);

export default RootElem;

export const htmlTemplateFactory = elementName => `
    <style>
      @import url('https://fonts.googleapis.com/css?family=Roboto');

      :host {
        display: block;
        contain: content;
        outline: none !important;
        box-shadow: none;
        position: relative;
        font-family: 'Roboto', sans-serif;
      }
      
      ::slotted([slot=preview-custom]) {
        display: none;
      }
    </style>
    <div>
        <slot name="preview-custom">
            <${elementName} id="default"></${elementName}>
        </slot>
        <slot name="configure-wrapper">            
        </slot>
    </div>
`;

class CustomPreviewModelUpdatedEvent extends CustomEvent {
  constructor(update, reset = false) {
    super(CustomPreviewModelUpdatedEvent.TYPE, { bubbles: true, detail: { update, reset } });
    this.update = update;
    this.reset = reset;
  }
}

CustomPreviewModelUpdatedEvent.TYPE = 'customPreviewModel.updated';

export class ConfigureWrapper extends HTMLElement {
  constructor() {
    super();
    this._noPreview = false;
    this.onModelChanged = this.onModelChanged.bind(this);
    this.indexTab = 0;
    const template = document.createElement('template');

    template.innerHTML = `
    <style>
        :host {
          display: block;
          contain: content;
          outline: none !important;
          box-shadow: none;
          min-height: 500px;
          position: relative;
        }
        
        ::slotted(.tabContent) {
            display: none;
            min-height: 500px;
            padding-top: 30px;
            width: 75%;
        }
        
        ::slotted(.tabContent.selected) {
            display: block;
        }
        
        ::slotted(.tabContent.full) {
            width: 100%;
        }

        ::slotted(.sidePanelClass) {
            max-width: 250px;
            position: fixed;
            right: 0;
            top: 0;
            width: 20% !important;
        }

        ::slotted(.ConfigLayout-sidePanel-138) {
            width: 300px !important;
        }

        .tabs-container {
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .tabs-container .tabs {
            background-color: #fafafa;
            border-bottom: 4px solid #eeeeee;
            display: flex;
            flex-direction: row;
            height: 48px;
            justify-content: flex-start;
            width: 75%;
        }
        
        .tabs-container .tabs.full {
            width: 100%;
        }

        .tabs-container .tabs .tab {
            cursor: pointer;
            color: #000;
            min-width: 100px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            width: 100px;
        }

        .hidden {
            display: none !important;
        }

        .visible {
            display: block !important;
        }

        .tabs-container .selected-line {
            background-color: #3f51b5;
            bottom: 4px;
            height: 4px;
            position: absolute;
            top: 48px;
            transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
    </style>
    <div class="tabs-container">
        <div class="tabs">
            <div class="tab designTab hidden selected" onclick="onTabClick(this, 0)">Design</div>
            <div class="tab previewTab hidden" onclick="onTabClick(this, 1)">Preview</div>
            <div class="tab settingsTab hidden" onclick="onTabClick(this, 2)">Settings</div>
        </div>
        <span class="selected-line" style="left: 0px; width: 100px;"></span>
        <div class="tab-content">
            <slot name="configure-custom">
            </slot>
            <slot name="preview-custom">
            </slot>
        </div>
    </div>
    <slot name="sidepanel-custom">
    </slot>
  `;

    window.onTabClick = (el, index) => {
      this.indexTab = index;

      if (this.onTabChanged) {
        this.onTabChanged(index);
      }

      this._render();
    };

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const ro = new ResizeObserver(() => {
      const tabs = this.shadowRoot.querySelector('.tabs');

      this.inTabSidePanel = this.offsetWidth * 0.20 < 190;

      if (this.inTabSidePanel) {
        tabs.classList.add('full');
      } else {
        tabs.classList.remove('full');
      }

      this._render();
    });

    ro.observe(this);
  }

  handleTabs() {
    const tabs = this.shadowRoot.querySelectorAll('.tabs .tab');
    const selectedLine = this.shadowRoot.querySelector('.selected-line');
    let selectedEl = tabs[0];

    tabs.forEach((tab, index) => {
      if (index === this.indexTab) {
        selectedEl = tab;
      }

      tab.classList.remove('selected')
    });

    selectedLine.style.left = `${this.indexTab * 100}px`;
    selectedEl.classList.add('selected');
  }

  set model(s) {
    this._model = s;
    this._render();
  }

  set configure(c) {
    this._configure = c;
    this._render();
  }

  set noPreview(noPreview) {
    this._noPreview = noPreview;
    this._render();
  }

  renderDesignTab() {
    if (this.configureElement) {
      if (!this._configureSlot) {
        const span = document.createElement('span');
        const settingsTabEl = this.shadowRoot.querySelector('.designTab');

        settingsTabEl.className = 'tab designTab visible';

        span.className = `tabContent selected${this.inTabSidePanel ? ' full' : ''}`;

        const element = React.createElement(this.configureElement.el, {
          ...this.configureElement.props,
          onModelChanged: this.onModelChanged,
        });

        const configLayout = React.createElement(RootElem, {
          regularOnly: true,
          regularItems: element,
        });

        span.setAttribute('slot', 'configure-custom');

        this._configureSlot = span;
        this.appendChild(span);

        ReactDOM.render(configLayout, span);
      } else {
        this._configureSlot.className = `tabContent${this.indexTab === 0 ? ' selected' : ''}${this.inTabSidePanel ? ' full' : ''}`;
      }
    } else {
      const settingsTabEl = this.shadowRoot.querySelector('.tabs-container');

      settingsTabEl.className = 'tabs-container hidden';
    }
  }

  onModelChanged(m, reset) {
    this._model = m;
    this.handlePreviewTab(reset);
    this.changeModel && this.changeModel(m, reset);
  }

  handlePreviewTab(reset) {
    const el = this._previewSlot ? this._previewSlot.firstChild : {};

    el.session = reset ? [] : this.previewSession;
    this.modelFn(this._model, el.session, {
      mode: 'gather'
    })
      .then((newModel) => {
        const sidePanelEl = this._sidePanel && this._sidePanel.el.firstChild;

        el.model = newModel;

        this.dispatchEvent(new CustomPreviewModelUpdatedEvent(this._model, reset));

        if (sidePanelEl) {
          const element = React.createElement(RootElem, {
            sideMenuItems: this.sideMenuItems,
            regularItems: null,
          });

          ReactDOM.render(element, this._sidePanel.el);
        }
      });
  }

  renderPreviewTab() {
    const existing = this.querySelector('[slot=preview-custom]');
    const settingsTabEl = this.shadowRoot.querySelector('.previewTab');

    if (!this._noPreview) {
      if (!this._previewSlot) {
        const span = document.createElement('span');

        settingsTabEl.className = 'tab previewTab visible';

        span.className = `tabContent${this.inTabSidePanel ? ' full' : ''}`;
        span.setAttribute('slot', 'preview-custom');

        span.innerHTML = this.markup;

        this._previewSlot = span;
        this.appendChild(span);
        this.handlePreviewTab();
      } else {
        this._previewSlot.className = `tabContent${this.indexTab === 1 ? ' selected' : ''}${this.inTabSidePanel ? ' full' : ''}`;
      }
    } else if (existing) {
      this._previewSlot = null;
      this.removeChild(existing);

      settingsTabEl.className = 'tab previewTab hidden';
    }
  }

  renderSidePanel() {
    let containerEl = this._sidePanel ? this._sidePanel.el : null;

    if (!this._sidePanel || (this._sidePanel && this._sidePanel.inTab !== this.inTabSidePanel)) {

      if (this._sidePanel) {
        this.removeChild(this._sidePanel.el);
      }

      const span = document.createElement('span');

      span.className = this.inTabSidePanel ? `tabContent${this.indexTab === 2 ? ' selected' : ''}${this.inTabSidePanel ? ' full' : ''}` : 'sidePanelClass';

      span.setAttribute('slot', 'sidepanel-custom');

      this._sidePanel = { el: span, inTab: this.inTabSidePanel };
      this.appendChild(span);

      containerEl = span;
    } else if (this._sidePanel) {
      this._sidePanel.el.className = this.inTabSidePanel ? `tabContent${this.indexTab === 2 ? ' selected' : ''}${this.inTabSidePanel ? ' full' : ''}` : 'sidePanelClass';
    }

    const settingsTabEl = this.shadowRoot.querySelector('.settingsTab');

    settingsTabEl.className = `tab settingsTab hidden ${this.inTabSidePanel ? ' visible' : ''}`;

    if (!this.inTabSidePanel && this.indexTab === 2) {
      this.indexTab = 1;
      this._render();
    }

    const element = React.createElement(RootElem, {
      sideMenuItems: this.sideMenuItems,
      regularItems: null,
      inTabForSure: this.inTabSidePanel && this.indexTab === 2
    });

    ReactDOM.render(element, containerEl);
  }

  _render() {
    this.handleTabs();

    if (this._model && this._configure) {
      this.renderDesignTab();
      this.renderPreviewTab();
      this.renderSidePanel();
    }
  }
}

customElements.define('configure-wrapper', ConfigureWrapper);
