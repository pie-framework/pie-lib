import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import uniq from 'lodash/uniq';
import isString from 'lodash/isString';
import { color } from '../render-ui';

import ToolMenu from './tool-menu';
import Graph, { graphPropTypes } from './graph';
import UndoRedo from './undo-redo';
import { allTools, toolsArr } from './tools';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export const setToolbarAvailability = (toolbarTools) =>
  toolsArr.map((tA) => ({ ...tA, toolbar: !!toolbarTools.find((t) => t === tA.type) })) || [];

export const toolIsAvailable = (tools, currentTool) =>
  currentTool && tools && (tools.find((tool) => tool.type === currentTool.type) || {}).toolbar;

export const getAvailableTool = (tools) => tools.find((tool) => tool.toolbar);

export const filterByValidToolTypes = (backgroundMarks) =>
  backgroundMarks.filter((bM) => !!allTools.find((tool) => tool === bM.type));

export const filterByVisibleToolTypes = (toolbarTools, marks) =>
  marks.filter((bM) => !!toolbarTools.find((tool) => tool === bM.type));

const getDefaultCurrentTool = (toolType) => toolsArr.find((tool) => tool.type === toolType) || null;

const Collapsible = ({ classes, children, title }) => (
  <ExpansionPanel elevation={0} className={classes.expansionPanel} disabledGutters={true} square={true}>
    <ExpansionPanelSummary
      classes={{
        root: classes.summaryRoot,
        content: classes.summaryContent,
      }}
      expandIcon={<ExpandMoreIcon />}
    >
      <Typography variant="subheading">{title}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails className={classes.details}>{children}</ExpansionPanelDetails>
  </ExpansionPanel>
);

Collapsible.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.array,
  title: PropTypes.string,
};

export class GraphWithControls extends React.Component {
  static propTypes = {
    ...graphPropTypes,
    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
    onReset: PropTypes.func,
    toolbarTools: PropTypes.arrayOf(PropTypes.string), // array of tool types that have to be displayed in the toolbar, same shape as 'allTools'
    language: PropTypes.string,
  };

  static defaultProps = {
    collapsibleToolbar: false,
    collapsibleToolbarTitle: '',
    disabledLabels: false,
    disabledTitle: false,
    showLabels: true,
    showTitle: true,
    toolbarTools: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      currentTool: getDefaultCurrentTool(props.defaultTool),
      labelModeEnabled: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { defaultTool } = this.props;

    if (prevProps.defaultTool !== defaultTool) {
      const currentTool = getDefaultCurrentTool(defaultTool);

      this.setState({ currentTool });
    }
  }

  changeCurrentTool = (tool, tools) => this.setState({ currentTool: tools.find((t) => t.type === tool) });

  toggleLabelMode = () => this.setState((state) => ({ labelModeEnabled: !state.labelModeEnabled }));

  render() {
    let { currentTool, labelModeEnabled } = this.state;
    const {
      axesSettings,
      classes,
      className,
      coordinatesOnHover,
      collapsibleToolbar,
      collapsibleToolbarTitle,
      disabled,
      disabledLabels,
      disabledTitle,
      domain,
      draggableTools,
      labels,
      labelsPlaceholders,
      onChangeLabels,
      onChangeMarks,
      onChangeTitle,
      onChangeTools,
      onUndo,
      onRedo,
      onReset,
      range,
      size,
      showLabels,
      showPixelGuides,
      showTitle,
      title,
      titlePlaceholder,
      language,
    } = this.props;
    let { backgroundMarks, marks, toolbarTools } = this.props;

    // make sure only valid tool types are kept (string) and without duplicates
    toolbarTools = uniq(toolbarTools || []).filter((tT) => !!isString(tT)) || [];

    // keep only the backgroundMarks that have valid types
    backgroundMarks = filterByValidToolTypes(backgroundMarks || []);

    // keep only the marks that have types which appear in toolbar
    marks = filterByVisibleToolTypes(toolbarTools, marks || []);

    const tools = setToolbarAvailability(toolbarTools);

    // set current tool if there's no current tool or if the existing one is no longer available
    if (!currentTool || !toolIsAvailable(tools, currentTool)) {
      currentTool = getAvailableTool(tools);
    }

    const graphActions = (
      <React.Fragment>
        <ToolMenu
          currentToolType={currentTool && currentTool.type}
          disabled={!!disabled}
          draggableTools={draggableTools}
          labelModeEnabled={labelModeEnabled}
          onChange={(tool) => this.changeCurrentTool(tool, tools)}
          onToggleLabelMode={this.toggleLabelMode}
          toolbarTools={toolbarTools}
          onChangeTools={onChangeTools}
          language={language}
        />

        {!disabled && <UndoRedo onUndo={onUndo} onRedo={onRedo} onReset={onReset} language={language} />}
      </React.Fragment>
    );

    return (
      <div className={classNames(classes.graphWithControls, className)}>
        <div className={classes.controls}>
          {collapsibleToolbar ? (
            <Collapsible classes={classes} title={collapsibleToolbarTitle}>
              {graphActions}
            </Collapsible>
          ) : (
            graphActions
          )}
        </div>

        <div ref={(r) => (this.labelNode = r)} />

        <Graph
          axesSettings={axesSettings}
          backgroundMarks={backgroundMarks}
          coordinatesOnHover={coordinatesOnHover}
          currentTool={currentTool}
          disabledLabels={disabledLabels}
          disabledTitle={disabledTitle}
          domain={domain}
          labels={labels}
          labelModeEnabled={labelModeEnabled}
          labelsPlaceholders={labelsPlaceholders}
          marks={marks}
          onChangeMarks={!disabled ? onChangeMarks : undefined}
          onChangeLabels={onChangeLabels}
          onChangeTitle={onChangeTitle}
          range={range}
          size={size}
          showLabels={showLabels}
          showPixelGuides={showPixelGuides}
          showTitle={showTitle}
          title={title}
          titlePlaceholder={titlePlaceholder}
          tools={tools}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  graphWithControls: {
    display: 'flex',
    flexDirection: 'column',
    width: 'min-content',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit,
    color: color.text(),
    backgroundColor: color.primaryLight(),
    '& button': {
      fontSize: theme.typography.fontSize,
    },
  },
  expansionPanel: {
    backgroundColor: color.primaryLight(),
    width: '100%',
  },
  summaryRoot: {
    padding: `0 ${theme.spacing.unit}px`,
    minHeight: '32px !important',
  },
  summaryContent: {
    margin: '4px 0 !important',
  },
  details: {
    padding: 0,
    marginTop: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default withStyles(styles)(GraphWithControls);
