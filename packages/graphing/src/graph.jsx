import React from 'react';
import PropTypes from 'prop-types';
import Labels from './labels';
import { Axes, AxisPropTypes } from './axis';
import Grid from './grid';
import { Root, types, createGraphProps } from '@pie-lib/plot';
import { LabelType } from './labels';
import debug from 'debug';
import Bg from './bg';
import _ from 'lodash';
import invariant from 'invariant';
import isEqual from 'lodash/isEqual';

const log = debug('pie-lib:graphing:graph');

export const graphPropTypes = {
  className: PropTypes.string,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  domain: types.DomainType,
  range: types.DomainType,
  title: PropTypes.string,
  axesSettings: PropTypes.shape(AxisPropTypes),
  labels: PropTypes.shape(LabelType),
  marks: PropTypes.array,
  backgroundMarks: PropTypes.array,
  onChangeMarks: PropTypes.func.isRequired,
  tools: PropTypes.array,
  defaultTool: PropTypes.string,
  labelModeEnabled: PropTypes.bool
};

export class Graph extends React.Component {
  static propTypes = {
    ...graphPropTypes,
    defaultTool: PropTypes.string,
    currentTool: PropTypes.object
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      currentTool: props.defaultTool
    };
  }

  getDefaultTool = () => {
    const { tools, defaultTool } = this.props;

    const d = tools.find(t => t.type === defaultTool);

    if (d) {
      return d;
    } else {
      return tools[0];
    }
  };

  changeMark = (oldMark, newMark) => {
    const { marks, onChangeMarks } = this.props;

    if (!marks) {
      throw new Error('no marks set?');
    }

    const index = marks.findIndex(m => _.isEqual(m, oldMark));

    if (index >= 0) {
      const out = [...marks];
      out.splice(index, 1, { ...newMark });
      log('[changeMark] call onChangeMarks');
      onChangeMarks(out);
    }
  };

  getBuildingMark = () => {
    const { marks } = this.props;

    const buildMarks = marks.filter(m => m.building);

    const l = buildMarks.length;
    invariant(l === 0 || l === 1, 'There can either be 0 or 1 build marks');
    return l === 1 ? buildMarks[0] : undefined;
  };

  onBgClick = ({ x, y }) => {
    log('[onBgClick] x,y: ', x, y);

    if (this.props.labelModeEnabled) {
      log('label mode!!!');
      return;
    }

    const buildingMark = this.getBuildingMark();
    const { currentTool } = this.props;
    const tool = currentTool || this.getDefaultTool();
    log('[onBgClick] currentTool: ', currentTool);

    const updatedMark = tool.addPoint({ x, y }, buildingMark ? { ...buildingMark } : undefined);
    log('[onBgClick] updatedMark: ', currentTool);

    this.updateMarks(buildingMark, updatedMark, true);
  };

  completeMark = markData => {
    log('[completeMark] -> ', markData);
    const buildingMark = this.getBuildingMark();

    if (!buildingMark) {
      return;
    }

    const tool = this.getTool();
    const updatedMark = tool.complete(buildingMark, markData);

    this.updateMarks(buildingMark, updatedMark);
  };

  updateMarks = (existing, update, addIfMissing = false) => {
    const { marks, onChangeMarks } = this.props;

    const index = marks.findIndex(m => isEqual(m, existing));
    if (index >= 0) {
      log('[updateMarks] -> splicing update, from: ', existing, 'to:', update);
      const out = [...this.props.marks];
      out.splice(index, 1, update);
      onChangeMarks(out);
    } else {
      if (addIfMissing) {
        log('[updateMarks] -> adding to marks array');
        onChangeMarks([...this.props.marks, update]);
      }
    }
  };

  getComponent = mark => {
    if (!mark) {
      return undefined;
    }

    const { tools } = this.props;

    const tool = (tools || []).find(t => t.type === mark.type);
    if (tool && tool.Component) {
      return tool.Component;
    } else {
      throw new Error(`No tool supports type ${mark.type}`);
    }
  };

  getTool = () => {
    const { currentTool } = this.props;
    return currentTool || this.getDefaultTool();
  };

  mouseMove = e => {
    let { buildingMark, dragging } = this.state;

    if (buildingMark && !dragging) {
      log('[mouseMove] have buildmark + not dragging... SET THE STATE');
      const tool = this.getTool();
      buildingMark = tool.hover ? tool.hover(e, buildingMark) : buildingMark;
      this.setState({ hoverPoint: e, buildingMark });
    }
  };

  removeMark = mark => {
    const { marks } = this.props;
    const index = marks.findIndex(m => isEqual(m, mark));
    if (index >= 0) {
      const out = [...marks];
      out.splice(index, 1);
      return out;
    }
  };

  componentDidUpdate(prevProps) {
    const { onChangeMarks } = this.props;
    const buildingMark = this.getBuildingMark();
    if (!_.isEqual(prevProps.currentTool, this.props.currentTool) && buildingMark !== undefined) {
      const marks = this.removeMark(buildingMark);
      if (marks) {
        onChangeMarks(marks);
      }
    }
  }

  clickComponent = point => {
    log('click component!', point);
    this.onBgClick(point);
  };

  componentDidMount = () => {
    this.setState({ labelNode: this.labelNode });
  };

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

    const marks = this.state.marks ? this.state.marks : this.props.marks;
    const tool = this.getTool();
    log('[render]', marks);

    const graphProps = createGraphProps(domain, range, size);
    const maskSize = {
      x: -10,
      y: -10,
      width: size.width + 20,
      height: size.height + 20
    };
    const common = { graphProps, labelModeEnabled };

    return (
      <Root title={title} onMouseMove={this.mouseMove} {...common}>
        <Grid {...common} />
        <Axes {...axesSettings} {...common} />
        <Bg {...size} onClick={this.onBgClick} {...common} />
        <Labels value={labels} {...common} />
        <mask id="myMask">
          <rect {...maskSize} fill="white" />
        </mask>
        <g id="marks" mask="url('#myMask')">
          {(backgroundMarks || []).map((m, index) => {
            const Component = this.getComponent(m);
            return (
              <Component
                key={`${m.type}-${index}-bg`}
                mark={{ ...m, disabled: true }}
                {...common}
              />
            );
          })}
          {(marks || []).map((m, index) => {
            const Component = this.getComponent(m);
            return (
              <Component
                key={`${m.type}-${index}`}
                mark={m}
                onChange={this.changeMark}
                onComplete={this.completeMark}
                onClick={this.clickComponent}
                onDragStart={this.startDrag}
                onDragStop={this.stopDrag}
                labelNode={this.state.labelNode}
                isToolActive={m.type === tool.type}
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
