import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { Root, types, createGraphProps } from '../plot';
import debug from 'debug';

import { Axes, AxisPropTypes } from './axis';
import Grid from './grid';
import { LabelType } from './labels';
import Bg from './bg';
import { isDuplicatedMark, areArraysOfObjectsEqual } from './utils';

const log = debug('pie-lib:graphing-solution-set:graph');

export const graphPropTypes = {
  axesSettings: PropTypes.shape(AxisPropTypes),
  backgroundMarks: PropTypes.array,
  className: PropTypes.string,
  collapsibleToolbar: PropTypes.bool,
  collapsibleToolbarTitle: PropTypes.string,
  disabledLabels: PropTypes.bool,
  disabledTitle: PropTypes.bool,
  domain: types.DomainType,
  labels: PropTypes.shape(LabelType),
  labelModeEnabled: PropTypes.bool,
  coordinatesOnHover: PropTypes.bool,
  marks: PropTypes.array,
  onChangeLabels: PropTypes.func,
  onChangeMarks: PropTypes.func,
  onChangeTitle: PropTypes.func,
  range: types.DomainType,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  showLabels: PropTypes.bool,
  showPixelGuides: PropTypes.bool,
  showTitle: PropTypes.bool,
  title: PropTypes.string,
  tools: PropTypes.array,
};

const getMaskSize = (size) => ({
  x: -23,
  y: -23,
  width: size.width + 46,
  height: size.height + 46,
});

export const removeBuildingToolIfCurrentToolDiffers = ({ marks, currentTool }) => {
  const buildingMark = marks.filter((m) => m.building)[0];
  let newMarks = cloneDeep(marks);

  if (buildingMark && currentTool && buildingMark.type !== currentTool.type) {
    const index = newMarks.findIndex((m) => isEqual(m, buildingMark));

    if (index >= 0) {
      newMarks.splice(index, 1);
    }
  }

  return newMarks;
};

export class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.maskUid = this.generateMaskId();
  }

  static propTypes = {
    ...graphPropTypes,
    currentTool: PropTypes.object,
  };

  static defaultProps = {
    onChangeMarks: () => {},
    disabledLabels: false,
    disabledTitle: false,
  };

  state = {};

  generateMaskId() {
    return 'graph-' + (Math.random() * 10000).toFixed();
  }

  componentDidMount = () => this.setState({ labelNode: this.labelNode });

  changeMark = (oldMark, newMark) => {
    const { onChangeMarks, marks, gssLineData } = this.props;

    if (gssLineData?.selectedTool === 'solutionSet') {
      return;
    }

    let newMarks = cloneDeep(marks);

    const index = newMarks.findIndex((m) => isEqual(m, oldMark));

    if (index >= 0 && !isDuplicatedMark(newMark, marks, oldMark)) {
      newMarks.splice(index, 1, newMark);

      onChangeMarks(newMarks);
    }
  };

  completeMark = (markData) => {
    const { currentTool, marks } = this.props;
    const buildingMark = marks.filter((m) => m.building)[0];

    if (!buildingMark || !currentTool) return;

    const updatedMark = currentTool.complete(buildingMark, markData);

    this.updateMarks(buildingMark, updatedMark);
  };

  updateMarks = (existing, update, addIfMissing = false) => {
    const { onChangeMarks, marks } = this.props;
    let newMarks = cloneDeep(marks);

    if (!update || (!update.building && isDuplicatedMark(update, marks))) {
      return;
    }

    const index = newMarks.findIndex((m) => isEqual(m, existing));

    if (index >= 0) {
      newMarks.splice(index, 1, update);

      onChangeMarks(newMarks);
    } else if (addIfMissing) {
      onChangeMarks([...newMarks, update]);
    }
  };

  getComponent = (mark) => {
    if (!mark) return null;

    const tool = (this.props.tools || []).find((t) => t.type === mark.type);

    return (tool && tool.Component) || null;
  };

  onBgClick = (point) => {
    const { x, y } = point || {};
    const { labelModeEnabled, currentTool, marks, gssLineData, onSolutionSetSelected } = this.props;
    if (gssLineData) {
      if (gssLineData.selectedTool === 'solutionSet') {
        onSolutionSetSelected(point);
        return;
      }
      if (
        gssLineData.numberOfLines === 1 &&
        gssLineData.selectedTool === 'lineA' &&
        marks.length === 1 &&
        !marks[0].building
      ) {
        return;
      }
      if (gssLineData.numberOfLines === 2 && gssLineData.selectedTool === 'lineA' && marks.length === 2) {
        return;
      }
      if (
        gssLineData.numberOfLines === 2 &&
        gssLineData.selectedTool === 'lineA' &&
        marks.length === 1 &&
        !marks[0].building
      ) {
        return;
      }
      if (
        gssLineData.numberOfLines === 2 &&
        gssLineData.selectedTool === 'lineB' &&
        marks.length === 2 &&
        !marks[1].building
      ) {
        return;
      }
    }
    if (labelModeEnabled || !currentTool || [null, undefined].includes(x) || [null, undefined].includes(y)) {
      return;
    }

    log('[onBgClick] x,y: ', x, y);

    const buildingMark = marks.filter((m) => m.building)[0];
    let updatedMark;

    // if the building mark has a different type, we just replace it
    if (buildingMark && currentTool && buildingMark.type === currentTool.type) {
      updatedMark = currentTool.addPoint({ x, y }, { ...buildingMark });
    } else {
      updatedMark = currentTool.addPoint({ x, y }, undefined);
    }

    this.updateMarks(buildingMark, updatedMark, true);
  };

  render() {
    const {
      axesSettings,
      currentTool,
      coordinatesOnHover,
      size,
      disabledLabels,
      disabledTitle,
      domain,
      backgroundMarks,
      range,
      title,
      labels,
      labelModeEnabled,
      labelsPlaceholders,
      showLabels,
      showPixelGuides,
      showTitle,
      titlePlaceholder,
      onChangeLabels,
      onChangeTitle,
      mathMlOptions = {},
      gssLineData,
      disabled,
    } = this.props;
    let { marks } = this.props;

    const graphProps = createGraphProps(domain, range, size, () => this.rootNode);

    const maskSize = getMaskSize(size);
    let common = { graphProps, labelModeEnabled, gssLineData };

    marks = removeBuildingToolIfCurrentToolDiffers({ marks: marks || [], currentTool });
    let solutionSet = marks.filter((mark) => mark.type === 'polygon');
    if (gssLineData && gssLineData.selectedTool === 'solutionSet') {
      gssLineData.sections.forEach((section) => {
        if (solutionSet.length === 0 || !areArraysOfObjectsEqual(section, solutionSet[0].points)) {
          let polygon = {
            type: 'polygon',
            building: false,
            closed: true,
            points: section,
            isSolution: false,
          };
          if (!disabled) marks.push(polygon);
        }
      });
    }
    //Adjusted layering of added svg elements so that polygons will be added first and lines will be added second
    let newMarks = [];
    newMarks.push(...marks.filter((mark) => mark.type === 'polygon'));
    newMarks.push(...marks.filter((mark) => mark.type === 'line'));

    return (
      <Root
        rootRef={(r) => (this.rootNode = r)}
        disabledTitle={disabledTitle}
        disabledLabels={disabledLabels}
        labels={labels}
        labelsPlaceholders={labelsPlaceholders || {}}
        showPixelGuides={showPixelGuides}
        showLabels={showLabels}
        showTitle={showTitle}
        title={title}
        titlePlaceholder={titlePlaceholder}
        onChangeTitle={onChangeTitle}
        onChangeLabels={onChangeLabels}
        mathMlOptions={mathMlOptions}
        {...common}
      >
        <g
          transform={
            domain && domain.padding && domain.range ? `translate(${domain.padding}, ${range.padding})` : undefined
          }
        >
          <Grid {...common} />
          <Axes {...axesSettings} {...common} />
          <Bg {...size} onClick={this.onBgClick} {...common} />
          <mask id={`${this.maskUid}`}>
            <rect {...maskSize} fill="white" /> {/* TODO hardcoded color */}
          </mask>

          <g id="marks" mask={`url('#${this.maskUid}')`}>
            {(backgroundMarks || []).map((m, index) => {
              const Component = this.getComponent(m);
              const markType = m.type;

              return (
                <Component
                  key={`${markType}-${index}-bg`}
                  mark={{ ...m, disabled: true, isBackground: true }}
                  labelNode={this.state.labelNode}
                  onClick={this.onBgClick}
                  {...common}
                />
              );
            })}

            {newMarks.map((m, index) => {
              const Component = this.getComponent(m);
              const markType = m.type;

              return (
                <Component
                  key={`${markType}-${index}`}
                  mark={m}
                  coordinatesOnHover={coordinatesOnHover}
                  onChange={this.changeMark}
                  onComplete={this.completeMark}
                  onClick={this.onBgClick}
                  onDragStart={this.startDrag}
                  onDragStop={this.stopDrag}
                  labelNode={this.state.labelNode}
                  isToolActive={currentTool && markType === currentTool.type}
                  {...common}
                />
              );
            })}
            <foreignObject
              ref={(labelNode) => (this.labelNode = labelNode)}
              x="0"
              y="0"
              {...size}
              style={{ pointerEvents: 'none', fontSize: '14px' }}
            />
          </g>
        </g>
      </Root>
    );
  }
}

export default Graph;
