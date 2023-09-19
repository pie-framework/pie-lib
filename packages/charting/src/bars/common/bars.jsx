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
const histogramColors = [
  '#006699',
  '#F59B00',
  '#08916D',
  '#529EE0',
  '#52B7D8',
  '#D9A6C2',
  '#FFB03B',
  '#54A77B',
  '#E16032',
  '#4FD2D2',
  '#F0E442',
  '#E287B2',
];
const hoverHistogramColors = [
  '#003754',
  '#975616',
  '#00503B',
  '#225982',
  '#1F687D',
  '#825E6F',
  '#996428',
  '#255E44',
  '#8A331F',
  '#167A7A',
  '#91862D',
  '#894A65',
];

export class RawBar extends React.Component {
  static propTypes = {
    barColor: PropTypes.string,
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
      isHovered: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

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
    const {
      graphProps,
      value,
      label,
      classes,
      xBand,
      index,
      interactive,
      correctness,
      barColor,
      defineChart,
      height,
    } = this.props;
    const { scale, range } = graphProps;
    const { dragValue, isHovered } = this.state;

    const v = Number.isFinite(dragValue) ? dragValue : value;
    const barWidth = xBand.bandwidth();
    const barHeight = scale.y(range.max - v);
    const barX = xBand(bandKey({ label }, index));
    const rawY = range.max - v;
    const yy = range.max - rawY;
    log('label:', label, 'barX:', barX, 'v: ', v, 'barHeight:', barHeight, 'barWidth: ', barWidth);

    const Component = interactive ? DraggableHandle : DragHandle;

    return (
      <g onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <VxBar
          x={barX}
          y={scale.y(yy)}
          width={barWidth}
          height={barHeight}
          className={classes.bar}
          style={
            isHovered && barColor
              ? { fill: hoverHistogramColors[index % hoverHistogramColors.length] }
              : isHovered
              ? { fill: color.primaryDark() }
              : barColor
              ? { fill: barColor }
              : {}
          }
        />
        <Component
          x={barX}
          y={v}
          defineChart={defineChart}
          height={height}
          interactive={interactive}
          width={barWidth}
          onDrag={(v) => this.dragValue(value, v)}
          onDragStop={this.dragStop}
          graphProps={graphProps}
          correctness={correctness}
          isHovered={isHovered}
          color={barColor ? hoverHistogramColors[index % hoverHistogramColors.length] : color.primaryDark()}
        />
      </g>
    );
  }
}

const Bar = withStyles(() => ({
  bar: {
    fill: color.primaryLight(),
    '&:hover': {
      fill: color.primaryDark(),
    },
  },
}))(RawBar);

export class Bars extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChangeCategory: PropTypes.func,
    defineChart: PropTypes.bool,
    xBand: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    histogram: PropTypes.bool,
  };

  render() {
    const { data, graphProps, xBand, onChangeCategory, defineChart, histogram, height } = this.props;

    return (
      <Group>
        {(data || []).map((d, index) => (
          <Bar
            value={d.value}
            interactive={defineChart || d.interactive}
            defineChart={defineChart}
            height={height}
            label={d.label}
            xBand={xBand}
            index={index}
            key={`bar-${d.label}-${d.value}-${index}`}
            onChangeCategory={(category) => onChangeCategory(index, category)}
            graphProps={graphProps}
            correctness={d.correctness}
            barColor={
              histogram &&
              (histogramColors[index] ? histogramColors[index] : histogramColors[index % histogramColors.length])
            }
          />
        ))}
      </Group>
    );
  }
}

export default Bars;
