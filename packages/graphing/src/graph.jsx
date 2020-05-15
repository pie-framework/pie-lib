import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
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

export const removeBuildingToolIfCurrentToolDiffers = ({ marks, currentTool }) => {
  const buildingMark = marks.filter(m => m.building)[0];
  let newMarks = cloneDeep(marks);

  if (buildingMark && currentTool && buildingMark.type !== currentTool.type) {
    const index = newMarks.findIndex(m => isEqual(m, buildingMark));

    if (index >= 0) {
      newMarks.splice(index, 1);
    }
  }

  return newMarks;
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

  componentDidMount = () => this.setState({ labelNode: this.labelNode });

  changeMark = (oldMark, newMark) => {
    const { onChangeMarks, marks } = this.props;
    let newMarks = cloneDeep(marks);

    const index = newMarks.findIndex(m => isEqual(m, oldMark));

    if (index >= 0) {
      newMarks.splice(index, 1, newMark);

      onChangeMarks(newMarks);
    }
  };

  completeMark = markData => {
    const { currentTool, marks } = this.props;
    const buildingMark = marks.filter(m => m.building)[0];

    if (!buildingMark || !currentTool) return;

    const updatedMark = currentTool.complete(buildingMark, markData);

    this.updateMarks(buildingMark, updatedMark);
  };

  updateMarks = (existing, update, addIfMissing = false) => {
    const { onChangeMarks, marks } = this.props;
    let newMarks = cloneDeep(marks);

    const index = newMarks.findIndex(m => isEqual(m, existing));

    if (index >= 0) {
      newMarks.splice(index, 1, update);

      onChangeMarks(newMarks);
    } else if (addIfMissing) {
      onChangeMarks([...newMarks, update]);
    }
  };

  getComponent = mark => {
    if (!mark) return null;

    const tool = (this.props.tools || []).find(t => t.type === mark.type);

    return (tool && tool.Component) || null;
  };

  onBgClick = ({ x, y }) => {
    log('[onBgClick] x,y: ', x, y);

    const { labelModeEnabled, currentTool, marks } = this.props;

    if (labelModeEnabled || !currentTool) return;

    const buildingMark = marks.filter(m => m.building)[0];
    let updatedMark;

    // if the building mark has a different type, we just replace it
    if (buildingMark && currentTool && buildingMark.type === currentTool.type) {
      updatedMark = currentTool.addPoint({ x, y }, { ...buildingMark });
    } else {
      updatedMark = currentTool.addPoint({ x, y }, undefined);
    }

    this.updateMarks(buildingMark, updatedMark, true);
  };

  clickComponent = point => this.onBgClick(point);

  render() {
    const {
      axesSettings,
      currentTool,
      size,
      domain,
      backgroundMarks,
      range,
      title,
      labels,
      labelModeEnabled
    } = this.props;
    let { marks } = this.props;

    const graphProps = createGraphProps(domain, range, size, () => this.rootNode);
    const maskSize = getMaskSize(size);
    const common = { graphProps, labelModeEnabled };

    marks = removeBuildingToolIfCurrentToolDiffers({ marks: marks || [], currentTool });

    return (
      <Root
        // left side requires an extra padding of 10, in order to fit next to tick labels like 1.5, 1.55...
        paddingLeft={60}
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
