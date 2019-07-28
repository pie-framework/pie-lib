import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { Group } from '@vx/group';
import { withStyles } from '@material-ui/core/styles/index';
import DragHandle from '../../common/drag-handle';
import debug from 'debug';
import { bandKey } from '../../utils';

const log = debug('pie-lib:chart:bars');

export class RawPlot extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    classes: PropTypes.object,
    label: PropTypes.string,
    xBand: PropTypes.func,
    index: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired,
    CustomBarElement: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      dragValue: undefined
    };
  }

  setDragValue = dragValue => this.setState({ dragValue });

  dragStop = () => {
    const { onChange, label } = this.props;
    const { dragValue } = this.state;
    log('[dragStop]', dragValue);

    if (dragValue !== undefined) {
      onChange({ label, value: dragValue });
    }

    this.setDragValue(undefined);
  };

  dragValue = (existing, next) => {
    log('[dragValue] next:', next);

    this.setDragValue(next);
  };

  render() {
    const { graphProps, value, label, classes, xBand, index, CustomBarElement } = this.props;
    const { scale, range, size } = graphProps;
    const { max } = range || {};
    const { dragValue } = this.state;

    const v = Number.isFinite(dragValue) ? dragValue : value;
    const barWidth = xBand.bandwidth();
    const barHeight = scale.y(range.max - v);
    const barX = xBand(bandKey({ label }, index));

    log('label:', label, 'barX:', barX, 'v: ', v, 'barHeight:', barHeight, 'barWidth: ', barWidth);

    const values = [];
    for (let i = 0; i < v; i++) {
      values.push(i);
    }
    const pointHeight = size.height / max;
    const pointDiameter = (pointHeight > barWidth ? barWidth : pointHeight) - 12;

    return (
      <React.Fragment>
        {values.map(index =>
          CustomBarElement({
            index,
            pointDiameter,
            barX,
            barWidth,
            pointHeight,
            label,
            value,
            classes,
            scale
          })
        )}
        <DragHandle
          x={barX}
          y={v}
          width={barWidth}
          onDrag={v => this.dragValue(value, v)}
          onDragStop={this.dragStop}
          graphProps={graphProps}
        />
      </React.Fragment>
    );
  }
}

const Bar = withStyles(theme => ({
  dot: {
    fill: theme.palette.primary.light
  },
  line: {
    stroke: theme.palette.primary.light
  }
}))(RawPlot);

export class Plot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    xBand: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    CustomBarElement: PropTypes.func
  };

  changeBar = (index, next) => {
    const { data, onChange } = this.props;

    if (index >= 0) {
      const update = [...data];
      update.splice(index, 1, next);
      onChange(update);
    }
  };

  render() {
    const { data, graphProps, xBand, CustomBarElement } = this.props;

    return (
      <Group>
        {(data || []).map((d, index) => (
          <Bar
            value={d.value}
            label={d.label}
            xBand={xBand}
            index={index}
            key={`bar-${d.label}-${d.value}-${index}`}
            onChange={next => this.changeBar(index, next)}
            graphProps={graphProps}
            CustomBarElement={CustomBarElement}
          />
        ))}
      </Group>
    );
  }
}

export default Plot;
