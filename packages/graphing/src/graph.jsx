import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Root, types, createGraphProps } from '@pie-lib/plot';
import debug from 'debug';

import Labels from './labels';
import { Axes, AxisPropTypes } from './axis';
import Grid from './grid';
import { LabelType } from './labels';
import Bg from './bg';

const log = debug('pie-lib:graphing:graph');

export const graphPropTypes = {
  axesSettings: PropTypes.shape(AxisPropTypes),
  backgroundMarks: PropTypes.array,
  className: PropTypes.string,
  domain: types.DomainType,
  labels: PropTypes.shape(LabelType),
  labelModeEnabled: PropTypes.bool,
  marks: PropTypes.array,
  onChangeMarks: PropTypes.func,
  range: types.DomainType,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  title: PropTypes.string,
  tools: PropTypes.array
};

const getMaskSize = size => ({
  x: -10,
  y: -10,
  width: size.width + 20,
  height: size.height + 20
});

export const removeBuildingToolIfCurrentToolDiffers = ({ marks, currentTool, state }) => {
  const buildingMark = marks.filter(m => m.building)[0];

  if (state && !isEqual(state.currentTool, currentTool) && buildingMark) {
    const index = marks.findIndex(m => isEqual(m, buildingMark));

    if (index >= 0) {
      marks.splice(index, 1);
    }
  }

  return marks;
};

export class Graph extends React.Component {
  static propTypes = {
    ...graphPropTypes,
    currentTool: PropTypes.object
  };

  static defaultProps = {
    onChangeMarks: () => {
    }
  };

  state = {};

  static getDerivedStateFromProps = (props, state) => {
    props = props || {};
    state = state || {};

    const { currentTool, marks } = props;
    let { tools } = props;
    let newMarks = [...marks] || [];

    tools = tools || [];
    newMarks = removeBuildingToolIfCurrentToolDiffers({ marks: newMarks, state, currentTool });

    return { currentTool, marks: newMarks, tools };
  };

  componentDidMount = () => this.setState({ labelNode: this.labelNode });

  changeMark = (oldMark, newMark) => {
    const { marks } = this.state;
    const { onChangeMarks } = this.props;

    const index = marks.findIndex(m => isEqual(m, oldMark));

    if (index >= 0) {
      marks.splice(index, 1, newMark);

      onChangeMarks(marks);
    }
  };

  completeMark = markData => {
    const { marks, currentTool } = this.state;
    const buildingMark = marks.filter(m => m.building)[0];

    if (!buildingMark || !currentTool) return;

    const updatedMark = currentTool.complete(buildingMark, markData);

    this.updateMarks(buildingMark, updatedMark);
  };

  updateMarks = (existing, update, addIfMissing = false) => {
    const { marks } = this.state;
    const { onChangeMarks } = this.props;

    const index = marks.findIndex(m => isEqual(m, existing));

    if (index >= 0) {
      marks.splice(index, 1, update);

      onChangeMarks(marks);
    } else if (addIfMissing) {
      onChangeMarks([...marks, update]);
    }
  };

  getComponent = mark => {
    if (!mark) return null;

    const tool = this.state.tools.find(t => t.type === mark.type);

    return (tool && tool.Component) || null;
  };

  mouseMove = e => {
    let { buildingMark, dragging, currentTool } = this.state;

    if (buildingMark && !dragging && currentTool) {
      buildingMark = currentTool.hover ? currentTool.hover(e, buildingMark) : buildingMark;

      this.setState({ hoverPoint: e, buildingMark });
    }
  };

  onBgClick = ({ x, y }) => {
    log('[onBgClick] x,y: ', x, y);

    const { labelModeEnabled } = this.props;
    const { marks, currentTool } = this.state;

    if (labelModeEnabled || !currentTool) return;

    const buildingMark = marks.filter(m => m.building)[0];

    const updatedMark = currentTool.addPoint(
      { x, y },
      buildingMark ? { ...buildingMark } : undefined
    );

    this.updateMarks(buildingMark, updatedMark, true);
  };

  clickComponent = point => this.onBgClick(point);

  render() {
    const {
      axesSettings,
      size,
      domain,
      backgroundMarks,
      range,
      title,
      labels,
      labelModeEnabled
    } = this.props;
    const { marks, currentTool } = this.state;

    const graphProps = createGraphProps(domain, range, size, () => this.rootNode);
    const maskSize = getMaskSize(size);
    const common = { graphProps, labelModeEnabled };

    return (
      <Root
        // left side requires an extra padding of 10, in order to fit next to tick labels like 1.5, 1.55...
        paddingLeft={60}
        onMouseMove={this.mouseMove}
        rootRef={r => (this.rootNode = r)}
        title={title}
        {...common}
      >
        <Grid {...common} />
        <Axes {...axesSettings} {...common} />
        <Bg {...size} onClick={this.onBgClick} {...common} />
        <Labels value={labels} {...common} />
        <mask id="myMask">
          <rect {...maskSize} fill="white"/>
        </mask>

        <g id="marks" mask="url('#myMask')">
          {(backgroundMarks || []).map((m, index) => {
            const Component = this.getComponent(m);
            const markType = m.type;

            return (
              <Component
                key={`${markType}-${index}-bg`}
                mark={{ ...m, disabled: true }}
                {...common}
              />
            );
          })}

          {marks.map((m, index) => {
            const Component = this.getComponent(m);
            const markType = m.type;

            return (
              <Component
                key={`${markType}-${index}`}
                mark={m}
                onChange={this.changeMark}
                onComplete={this.completeMark}
                onClick={this.clickComponent}
                onDragStart={this.startDrag}
                onDragStop={this.stopDrag}
                labelNode={this.state.labelNode}
                isToolActive={currentTool && markType === currentTool.type}
                {...common}
              />
            );
          })}

          <foreignObject
            ref={labelNode => (this.labelNode = labelNode)}
            x="0"
            y="0"
            {...size}
            style={{ pointerEvents: 'none' }}
          />
        </g>
      </Root>
    );
  }
}

export default Graph;
