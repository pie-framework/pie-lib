import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import uniq from 'lodash/uniq';
import isString from 'lodash/isString';
import { color } from '@pie-lib/render-ui';
import ToolMenu from './tool-menu';
import Graph, { graphPropTypes } from './graph';
import UndoRedo from './undo-redo';
import { allTools, toolsArr } from './tools';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const setToolbarAvailability = (toolbarTools) =>
  toolsArr.map((tA) => ({
    ...tA,
    toolbar: !!toolbarTools.find((t) => t === tA.type),
  })) || [];

export const toolIsAvailable = (tools, currentTool) =>
  currentTool && tools && (tools.find((tool) => tool.type === currentTool.type) || {}).toolbar;

export const getAvailableTool = (tools) => tools.find((tool) => tool.toolbar);

export const filterByValidToolTypes = (backgroundMarks) =>
  backgroundMarks.filter((bM) => !!allTools.find((tool) => tool === bM.type));

export const filterByVisibleToolTypes = (toolbarTools, marks) =>
  marks.filter((bM) => !!toolbarTools.find((tool) => tool === bM.type));

const getDefaultCurrentTool = (toolType) =>
  toolsArr.find((tool) => tool.type === toolType) || null;

const GraphWithControlsRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: 'min-content',
}));

const Controls = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: 'calc(1.25rem - 12px) calc(1.25rem - 12px) 1.25rem',
  color: color.text(),
  backgroundColor: '#9FA8DA',
  '& button': {
    fontSize: '0.875rem',
    padding: '0.25rem .3rem',
    width: '5rem',
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: color.primaryLight(),
  width: '100%',
  boxShadow: 'none',
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: `0 ${theme.spacing(1)}`,
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

const UndoRedoOuterDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '.5rem',
}));

const Collapsible = ({ children, title }) => (
  <StyledAccordion square disableGutters>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="subtitle1">{title}</Typography>
    </StyledAccordionSummary>
    <StyledAccordionDetails>{children}</StyledAccordionDetails>
  </StyledAccordion>
);

Collapsible.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export class GraphWithControls extends React.Component {
  static propTypes = {
    ...graphPropTypes,
    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
    onReset: PropTypes.func,
    toolbarTools: PropTypes.arrayOf(PropTypes.string),
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
    this.setState({ currentTool: tools.find((t) => t.type === tool) });

  toggleLabelMode = () =>
    this.setState((state) => ({ labelModeEnabled: !state.labelModeEnabled }));

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
      labels,
      labelsPlaceholders,
      onChangeLabels,
      onChangeMarks,
      onChangeTitle,
      onUndo,
      onRedo,
      range,
      size,
      showLabels,
      showPixelGuides,
      showTitle,
      title,
      titlePlaceholder,
      language,
      disableToolbar = false,
      gssLineData,
      onChangeGssLineData,
      onSolutionSetSelected,
      onCustomReset,
    } = this.props;

    let { backgroundMarks, marks, toolbarTools } = this.props;

    toolbarTools = uniq(toolbarTools || []).filter((tT) => !!isString(tT)) || [];
    backgroundMarks = filterByValidToolTypes(backgroundMarks || []);
    marks = filterByVisibleToolTypes(toolbarTools, marks || []);

    if (gssLineData && gssLineData.lineA && marks[0] && marks[0].type === 'line')
      marks[0].fill = gssLineData.lineA.lineType;
    if (gssLineData && gssLineData.lineB && marks[1] && marks[1].type === 'line')
      marks[1].fill = gssLineData.lineB.lineType;

    const tools = setToolbarAvailability(toolbarTools);
    if (!currentTool || !toolIsAvailable(tools, currentTool)) {
      currentTool = getAvailableTool(tools);
    }

    const gssActions = gssLineData && (
      <>
        <ToolMenu
          numberOfLines={gssLineData.numberOfLines}
          gssLineData={gssLineData}
          onChange={onChangeGssLineData}
          disabled={!!disabled}
          language={language}
        />
        {!disabled && (
          <UndoRedoOuterDiv>
            <UndoRedo
              onUndo={onUndo}
              onRedo={onRedo}
              onReset={onCustomReset}
              language={language}
            />
          </UndoRedoOuterDiv>
        )}
      </>
    );

    return (
      <GraphWithControlsRoot className={classNames(className)}>
        {!disableToolbar && (
          <Controls>
            {collapsibleToolbar ? (
              <Collapsible title={collapsibleToolbarTitle}>{gssActions}</Collapsible>
            ) : (
              gssActions
            )}
          </Controls>
        )}

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
          gssLineData={gssLineData}
          onSolutionSetSelected={onSolutionSetSelected}
          disabled={!!disabled}
        />
      </GraphWithControlsRoot>
    );
  }
}

export default GraphWithControls;
