import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { Group } from '@vx/group';
import { withStyles } from '@material-ui/core/styles/index';
import DraggableHandle, { DragHandle } from '../../common/drag-handle';
import debug from 'debug';
import { color } from '@pie-lib/render-ui';
import { bandKey } from '../../utils';
import { correct, incorrect } from '../../common/styles';

const log = debug('pie-lib:chart:bars');

export class RawPlot extends React.Component {
  static propTypes = {
    onChangeCategory: PropTypes.func,
    value: PropTypes.number,
    classes: PropTypes.object,
    label: PropTypes.string,
    xBand: PropTypes.func,
    index: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired,
    CustomBarElement: PropTypes.func,
    interactive: PropTypes.bool,
    correctness: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      dragValue: undefined
    };
  }

  setDragValue = dragValue => this.setState({ dragValue });

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
    const {
      graphProps,
      value,
      label,
      classes,
      xBand,
      index,
      CustomBarElement,
      interactive,
      correctness
    } = this.props;
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
    const pointDiameter = (pointHeight > barWidth ? barWidth : pointHeight) * 0.8;
    const Component = interactive ? DraggableHandle : DragHandle;

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
        <Component
          x={barX}
          y={v}
          interactive={interactive}
          width={barWidth}
          onDrag={v => this.dragValue(value, v)}
          onDragStop={this.dragStop}
          graphProps={graphProps}
          correctness={correctness}
        />
      </React.Fragment>
    );
  }
}

const Bar = withStyles(theme => ({
  dot: {
    fill: color.primaryLight(),
    '&.correct': correct('stroke'),
    '&.incorrect': incorrect('stroke')
  },
  line: {
    stroke: color.primaryLight(),
    '&.correct': correct('stroke'),
    '&.incorrect': incorrect('stroke')
  }
}))(RawPlot);

export class Plot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChangeCategory: PropTypes.func,
    xBand: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    CustomBarElement: PropTypes.func
  };

  render() {
    const { data, graphProps, xBand, CustomBarElement, onChangeCategory } = this.props;

    return (
      <Group>
        {(data || []).map((d, index) => (
          <Bar
            value={d.value}
            label={d.label}
            interactive={d.interactive}
            xBand={xBand}
            index={index}
            key={`bar-${d.label}-${d.value}-${index}`}
            onChangeCategory={category => onChangeCategory(index, category)}
            graphProps={graphProps}
            CustomBarElement={CustomBarElement}
            correctness={d.correctness}
          />
        ))}
      </Group>
    );
  }
}

export default Plot;
