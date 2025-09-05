import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { Bar as VxBar } from '@vx/shape';
import { withStyles } from '@material-ui/core/styles/index';
import debug from 'debug';

import { color } from '../../../render-ui';
import { types } from '../../../plot';
import { bandKey } from '../../utils';
import DraggableHandle, { DragHandle } from '../../common/drag-handle';
import { CorrectCheckIcon } from './correct-check-icon';

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

const calculateFillColor = (isHovered, barColor, index, hoverHistogramColors, allowRolloverEvent) => {
  if (isHovered && barColor && allowRolloverEvent) {
    return hoverHistogramColors[index % hoverHistogramColors.length];
  }
  if (isHovered && allowRolloverEvent) {
    return color.visualElementsColors.ROLLOVER_FILL_BAR_COLOR;
  }
  return barColor || null;
};

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
    correctData: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragValue: undefined,
      isHovered: false,
    };
    this.mouseX = 0;
    this.mouseY = 0;
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (e) => {
    // Update mouse position
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    // Check if the mouse is inside the <g> element
    const isMouseInside = this.isMouseInsideSvgElement();
    this.setState({ isHovered: isMouseInside });
  };

  isMouseInsideSvgElement = () => {
    const gBoundingBox = this.gRef.getBoundingClientRect();
    // Check if the mouse position is within the bounding box
    return (
      this.mouseX >= gBoundingBox.left &&
      this.mouseX <= gBoundingBox.right &&
      this.mouseY >= gBoundingBox.top &&
      this.mouseY <= gBoundingBox.bottom
    );
  };

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
      correctData,
    } = this.props;
    const { scale, range } = graphProps;
    const { dragValue, isHovered } = this.state;

    const allowRolloverEvent = interactive && !correctness;
    const fillColor = calculateFillColor(isHovered, barColor, index, hoverHistogramColors, allowRolloverEvent);
    const v = Number.isFinite(dragValue) ? dragValue : value;
    const barWidth = xBand.bandwidth();
    const barHeight = scale.y(range.max - v);
    const barX = xBand(bandKey({ label }, index));
    const rawY = range.max - v;
    const yy = range.max - rawY;
    const correctValue = correctData ? correctData.find((d) => d.label === label) : null;
    log('label:', label, 'barX:', barX, 'v: ', v, 'barHeight:', barHeight, 'barWidth: ', barWidth);

    const Component = interactive ? DraggableHandle : DragHandle;
    const isHistogram = !!barColor;

    return (
      <g
        ref={(ref) => (this.gRef = ref)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleMouseEnter}
        onTouchEnd={this.handleMouseLeave}
      >
        <VxBar
          x={barX}
          y={scale.y(yy)}
          width={barWidth}
          height={barHeight}
          className={classes.bar}
          style={{ fill: fillColor }}
        />
        {correctness &&
          correctness.value === 'incorrect' &&
          (() => {
            const correctVal = parseFloat(correctValue && correctValue.value);
            if (isNaN(correctVal)) return null;
            const correctPxHeight = scale.y(range.max - correctVal);
            const actualPxHeight = barHeight;
            const diffPx = Math.abs(correctPxHeight - actualPxHeight);
            const yDiff = scale.y(correctVal);
            const indicatorBarColor = correctPxHeight > actualPxHeight ? color.borderGray() : color.defaults.WHITE;
            const yToRender = correctPxHeight > actualPxHeight ? yDiff : yDiff - diffPx;

            return (
              <>
                <VxBar
                  x={barX + 2} // add 2px for the stroke (the dashed border)
                  y={yToRender}
                  width={barWidth - 4} // substract 4px for the total stroke
                  height={diffPx}
                  className={classes.bar}
                  style={{
                    stroke: indicatorBarColor,
                    strokeWidth: 2,
                    strokeDasharray: '5,2',
                    fill: 'none',
                  }}
                />
                {/* adjust the position based on whether it's a histogram or not, because the histogram does not have space for the icon on the side */}
                <foreignObject x={barX + barWidth - (isHistogram ? 24 : 14)} y={yDiff - 12} width={24} height={24}>
                  <CorrectCheckIcon dashColor={indicatorBarColor} />
                </foreignObject>
              </>
            );
          })()}
        <Component
          x={barX}
          y={v}
          defineChart={defineChart}
          interactive={interactive}
          width={barWidth}
          onDrag={(v) => this.dragValue(value, v)}
          onDragStop={this.dragStop}
          graphProps={graphProps}
          correctness={correctness}
          isHovered={isHovered}
          color={fillColor}
        />
      </g>
    );
  }
}

const Bar = withStyles((theme) => ({
  bar: {
    fill: color.defaults.TERTIARY,
  },
  correctIcon: {
    backgroundColor: color.correct(),
    borderRadius: theme.spacing.unit * 2,
    color: color.defaults.WHITE,
    fontSize: '10px',
    padding: '2px',
    border: `1px solid ${color.defaults.WHITE}`,
  },
}))(RawBar);

export class Bars extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    correctData: PropTypes.array,
    onChangeCategory: PropTypes.func,
    defineChart: PropTypes.bool,
    xBand: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    histogram: PropTypes.bool,
  };

  render() {
    const { data, graphProps, xBand, onChangeCategory, defineChart, histogram, correctData } = this.props;

    return (
      <Group>
        {(data || []).map((d, index) => (
          <Bar
            value={d.value}
            interactive={defineChart || d.interactive}
            defineChart={defineChart}
            label={d.label}
            xBand={xBand}
            index={index}
            key={`bar-${d.label}-${d.value}-${index}`}
            onChangeCategory={(category) => onChangeCategory(index, category)}
            graphProps={graphProps}
            correctness={d.correctness}
            correctData={correctData}
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
