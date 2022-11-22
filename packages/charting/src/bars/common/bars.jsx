import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { Group } from '@vx/group';
import { color } from '@pie-lib/render-ui';
import { Bar as VxBar } from '@vx/shape';
import { withStyles } from '@material-ui/core/styles/index';
import debug from 'debug';
import { bandKey } from '../../utils';
import DraggableHandle, { DragHandle } from '../../common/drag-handle';

const log = debug('pie-lib:chart:bars');

export class RawBar extends React.Component {
  static propTypes = {
    onChangeCategory: PropTypes.func,
    value: PropTypes.number,
    classes: PropTypes.object,
    label: PropTypes.string,
    xBand: PropTypes.func,
    index: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired,
    interactive: PropTypes.bool,
    correctness: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      dragValue: undefined,
    };
  }

  setDragValue = (dragValue) => this.setState({ dragValue });

  dragStop = () => {
    const { label, onChangeCategory } = this.props;
    const { dragValue } = this.state;
    log('[dragStop]', dragValue);

    if (dragValue !== undefined) {
      onChangeCategory({ label, value: dragValue });
    }

    this.setDragValue(undefined);
  };

  dragValue = (existing, next) => {
    log('[dragValue] next:', next);

    this.setDragValue(next);
  };

  render() {
    const { graphProps, value, label, classes, xBand, index, interactive, correctness } = this.props;

    const { scale, range } = graphProps;
    const { dragValue } = this.state;

    const v = Number.isFinite(dragValue) ? dragValue : value;
    const barWidth = xBand.bandwidth();
    const barHeight = scale.y(range.max - v);
    const barX = xBand(bandKey({ label }, index));
    const rawY = range.max - v;
    const yy = range.max - rawY;
    log('label:', label, 'barX:', barX, 'v: ', v, 'barHeight:', barHeight, 'barWidth: ', barWidth);

    const Component = interactive ? DraggableHandle : DragHandle;

    return (
      <React.Fragment>
        <VxBar x={barX} y={scale.y(yy)} width={barWidth} height={barHeight} className={classes.bar} />
        <Component
          x={barX}
          y={v}
          interactive={interactive}
          width={barWidth}
          onDrag={(v) => this.dragValue(value, v)}
          onDragStop={this.dragStop}
          graphProps={graphProps}
          correctness={correctness}
        />
      </React.Fragment>
    );
  }
}

const Bar = withStyles(() => ({
  bar: {
    fill: color.primaryLight(),
  },
}))(RawBar);

export class Bars extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChangeCategory: PropTypes.func,
    defineChart: PropTypes.bool,
    xBand: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const { data, graphProps, xBand, onChangeCategory, defineChart } = this.props;

    return (
      <Group>
        {(data || []).map((d, index) => (
          <Bar
            value={d.value}
            interactive={defineChart || d.interactive}
            label={d.label}
            xBand={xBand}
            index={index}
            key={`bar-${d.label}-${d.value}-${index}`}
            onChangeCategory={(category) => onChangeCategory(index, category)}
            graphProps={graphProps}
            correctness={d.correctness}
          />
        ))}
      </Group>
    );
  }
}

export default Bars;
