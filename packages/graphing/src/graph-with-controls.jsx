import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import uniq from 'lodash/uniq';
import isString from 'lodash/isString';
import { color } from '@pie-lib/render-ui';

import ToolMenu from './tool-menu';
import Graph, { graphPropTypes } from './graph';
import UndoRedo from './undo-redo';
import { allTools, toolsArr } from './tools';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledGraphContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: 'min-content',
});

const StyledControls = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  color: color.text(),
  backgroundColor: color.primaryLight(),
  '& button': {
    fontSize: theme.typography.fontSize,
  },
}));

const StyledAccordion = styled(Accordion)({
  backgroundColor: color.primaryLight(),
  width: '100%',
});

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: `0 ${theme.spacing(1)}px`,
  minHeight: '32px !important',
  '& .MuiAccordionSummary-content': {
    margin: '4px 0 !important',
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: 0,
  marginTop: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
}));

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

const Collapsible = ({ children, title }) => (
  <StyledAccordion elevation={0} disableGutters={true} square={true}>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="subheading">{title}</Typography>
    </StyledAccordionSummary>
    <StyledAccordionDetails>{children}</StyledAccordionDetails>
  </StyledAccordion>
);

Collapsible.propTypes = {
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

  changeCurrentTool = (tool, tools) =>
    this.setState({ currentTool: tools.find((t) => t.type === tool), labelModeEnabled: tool === 'label' });

  render() {
    let { currentTool, labelModeEnabled } = this.state;
    const {
      axesSettings,
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
      removeIncompleteTool,
      limitLabeling,
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
          toolbarTools={toolbarTools}
          onChangeTools={onChangeTools}
          language={language}
        />

        {!disabled && <UndoRedo onUndo={onUndo} onRedo={onRedo} onReset={onReset} language={language} />}
      </React.Fragment>
    );

    return (
      <StyledGraphContainer className={className}>
        <StyledControls>
          {collapsibleToolbar ? (
            <Collapsible title={collapsibleToolbarTitle}>
              {graphActions}
            </Collapsible>
          ) : (
            graphActions
          )}
        </StyledControls>

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
          removeIncompleteTool={removeIncompleteTool}
          limitLabeling={limitLabeling}
        />
      </StyledGraphContainer>
    );
  }
}

export default GraphWithControls;
