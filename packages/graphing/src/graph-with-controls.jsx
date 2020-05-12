import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import uniq from 'lodash/uniq';
import isString from 'lodash/isString';

import ToolMenu from './tool-menu';
import Graph, { graphPropTypes } from './graph';
import UndoRedo from './undo-redo';
import { allTools, toolsArr } from './tools';

export const setToolbarAvailability = toolbarTools =>
  toolsArr.map(tA => ({
    ...tA,
    toolbar: !!toolbarTools.find(t => t === tA.type)
  })) || [];

export const toolIsAvailable = (tools, currentTool) =>
  currentTool && tools && (tools.find(tool => tool.type === currentTool.type) || {}).toolbar;

export const getAvailableTool = tools => tools.find(tool => tool.toolbar);

export const filterByValidToolTypes = backgroundMarks =>
  backgroundMarks.filter(bM => !!allTools.find(tool => tool === bM.type));

export const filterByVisibleToolTypes = (toolbarTools, marks) =>
  marks.filter(bM => !!toolbarTools.find(tool => tool === bM.type));

export class GraphWithControls extends React.Component {
  static propTypes = {
    ...graphPropTypes,
    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
    onReset: PropTypes.func,
    toolbarTools: PropTypes.arrayOf(PropTypes.string) // array of tool types that have to be displayed in the toolbar, same shape as 'allTools'
  };

  static defaultProps = {
    toolbarTools: []
  };

  state = {};

  static getDerivedStateFromProps = (props, state) => {
    props = props || {};
    state = state || {};

    let { backgroundMarks, marks, toolbarTools } = props;
    let { currentTool, labelModeEnabled } = state;

    backgroundMarks = backgroundMarks || [];
    marks = marks || [];
    toolbarTools = uniq(toolbarTools || []).filter(tT => !!isString(tT)) || [];

    const tools = setToolbarAvailability(toolbarTools);

    // set current tool if there's no current tool or if the previous one is no longer available
    if (!currentTool || !toolIsAvailable(tools, currentTool)) {
      currentTool = getAvailableTool(tools);
    }

    return {
      // keep only the backgroundMarks that have valid types
      backgroundMarks: filterByValidToolTypes(backgroundMarks),
      currentTool,
      labelModeEnabled,
      // keep only the marks that have types which appear in toolbar
      marks: filterByVisibleToolTypes(toolbarTools, marks),
      tools,
      toolbarTools
    };
  };

  changeCurrentTool = currentTool =>
    this.setState(state => ({ currentTool: state.tools.find(tool => tool.type === currentTool) }));

  toggleLabelMode = () => this.setState(state => ({ labelModeEnabled: !state.labelModeEnabled }));

  render() {
    const {
      backgroundMarks,
      currentTool,
      labelModeEnabled,
      marks,
      tools,
      toolbarTools
    } = this.state;
    const {
      axesSettings,
      classes,
      className,
      disabled,
      domain,
      labels,
      onChangeMarks,
      onUndo,
      onRedo,
      onReset,
      range,
      size,
      title
    } = this.props;

    return (
      <div className={classNames(classes.graphWithControls, className)}>
        <div className={classes.controls}>
          <ToolMenu
            currentToolType={currentTool && currentTool.type}
            disabled={!!disabled}
            labelModeEnabled={labelModeEnabled}
            onChange={this.changeCurrentTool}
            onToggleLabelMode={this.toggleLabelMode}
            toolbarTools={toolbarTools}
          />

          {!disabled && <UndoRedo onUndo={onUndo} onRedo={onRedo} onReset={onReset}/>}
        </div>

        <div ref={r => (this.labelNode = r)}/>

        <Graph
          axesSettings={axesSettings}
          backgroundMarks={backgroundMarks}
          currentTool={currentTool}
          domain={domain}
          labels={labels}
          labelModeEnabled={labelModeEnabled}
          marks={marks}
          onChangeMarks={!disabled ? onChangeMarks : undefined}
          range={range}
          size={size}
          title={title}
          tools={tools}
        />
      </div>
    );
  }
}

const styles = theme => ({
  graphWithControls: {},
  controls: {
    width: 'inherit',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.primary.light,
    borderTop: `solid 1px ${theme.palette.primary.dark}`,
    borderBottom: `solid 0px ${theme.palette.primary.dark}`,
    borderLeft: `solid 1px ${theme.palette.primary.dark}`,
    borderRight: `solid 1px ${theme.palette.primary.dark}`
  }
});

export default withStyles(styles)(GraphWithControls);
