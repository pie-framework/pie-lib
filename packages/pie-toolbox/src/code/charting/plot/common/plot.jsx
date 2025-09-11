import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Check from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles/index';
import { Group } from '@vx/group';
import debug from 'debug';

import { types } from '../../../plot';
import DraggableHandle, { DragHandle } from '../../common/drag-handle';
import { color } from '../../../render-ui';
import { bandKey } from '../../utils';
import { correct, incorrect } from '../../common/styles';

const log = debug('pie-lib:chart:bars');
const ICON_SIZE = 16; // 10px icon + 2px padding on all sides + 1px border

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

  renderCorrectnessIcon = (barX, barWidth, correctVal, correctness, classes, scale) => (
    <foreignObject
      x={barX + barWidth / 2 - ICON_SIZE / 2}
      y={scale.y(correctVal) + ICON_SIZE}
      width={ICON_SIZE}
      height={ICON_SIZE}
    >
      <Check
        className={classNames(classes.correctnessIcon, classes.correctIcon, classes.smallIcon)}
        title={correctness.label}
      />
    </foreignObject>
  );

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
      correctness,
      defineChart,
      correctData,
    } = this.props;

    const { scale, range, size } = graphProps;
    const { max } = range || {};
    const { dragValue, isHovered } = this.state;

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
    const allowRolloverEvent = interactive && !correctness;

    return (
      <React.Fragment>
        <g
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onTouchStart={this.handleMouseEnter}
          onTouchEnd={this.handleMouseLeave}
        >
          {isHovered && allowRolloverEvent && (
            <rect
              x={barX}
              y={scale.y(v)}
              width={barWidth}
              height={values?.length ? pointHeight * values.length : 0}
              stroke={color.defaults.BORDER_GRAY}
              strokeWidth={'4px'}
              fill={'transparent'}
            />
          )}
          {values.map((index) =>
            CustomBarElement({
              index,
              pointDiameter,
              barX,
              barWidth,
              pointHeight,
              label,
              value,
              classes,
              scale,
            }),
          )}
          {correctness &&
            correctness.value === 'incorrect' &&
            (() => {
              const correctVal = parseFloat(correctData[index] && correctData[index].value);
              if (isNaN(correctVal)) return null;
              const selectedVal = v;
              if (selectedVal > correctVal) {
                // selected is higher than correct: overlay the correct last segment
                const overlayValues = [];
                for (let i = 0; i < correctVal; i++) {
                  overlayValues.push(i);
                }
                const lastIndexOfOverlay = overlayValues.length - 1;
                const lastOverlayValue = overlayValues[lastIndexOfOverlay];
                const barX = xBand(bandKey({ label }, index));
                const barWidth = xBand.bandwidth();
                const pointHeight = size.height / max;
                const pointDiameter = (pointHeight > barWidth ? barWidth : pointHeight) * 0.8;
                return (
                  <>
                    <CustomBarElement
                      index={lastOverlayValue}
                      pointDiameter={pointDiameter + 10} // increase point diameter for dotted line
                      barX={barX}
                      barWidth={barWidth}
                      pointHeight={pointHeight}
                      label={label}
                      value={value}
                      classes={classes}
                      scale={scale}
                      dottedOverline={true}
                    />
                    {this.renderCorrectnessIcon(barX, barWidth, correctVal, correctness, classes, scale)}
                  </>
                );
              }
              // selected is lower than correct, render missing segment below the correct bar
              const valuesToRender = [];
              for (let i = selectedVal; i < correctVal; i++) {
                valuesToRender.push(i);
              }
              return (
                <>
                  {valuesToRender.map((idx) =>
                    CustomBarElement({
                      index: idx,
                      pointDiameter,
                      barX,
                      barWidth,
                      pointHeight,
                      label,
                      value,
                      classes,
                      scale,
                      dottedOverline: true,
                    }),
                  )}
                  {this.renderCorrectnessIcon(barX, barWidth, correctVal, correctness, classes, scale)}
                </>
              );
            })()}
          <Component
            x={barX}
            y={v}
            interactive={interactive}
            width={barWidth}
            onDrag={(v) => this.dragValue(value, v)}
            onDragStop={this.dragStop}
            graphProps={graphProps}
            correctness={correctness}
            isHovered={isHovered}
            defineChart={defineChart}
            color={color.primaryDark()}
            isPlot
          />
        </g>
      </React.Fragment>
    );
  }
}

const Bar = withStyles((theme) => ({
  dot: {
    fill: color.visualElementsColors.PLOT_FILL_COLOR,
    '&.correct': correct('stroke'),
    '&.incorrect': incorrect('stroke'),
  },
  dotColor: {
    fill: color.visualElementsColors.PLOT_FILL_COLOR,
    '&.correct': correct('fill'),
    '&.incorrect': incorrect('fill'),
  },
  line: {
    stroke: color.visualElementsColors.PLOT_FILL_COLOR,
    '&.correct': correct('stroke'),
    '&.incorrect': incorrect('stroke'),
  },
  correctIcon: {
    backgroundColor: color.correct(),
  },
  incorrectIcon: {
    backgroundColor: color.incorrectWithIcon(),
  },
  correctnessIcon: {
    borderRadius: theme.spacing.unit * 2,
    color: color.defaults.WHITE,
    fontSize: '16px',
    width: '16px',
    height: '16px',
    padding: '2px',
    border: `1px solid ${color.defaults.WHITE}`,
    stroke: 'initial',
    boxSizing: 'unset', // to override the default border-box in IBX
  },
  smallIcon: {
    fontSize: '10px',
    width: '10px',
    height: '10px',
  },
}))(RawPlot);

export class Plot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChangeCategory: PropTypes.func,
    xBand: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    defineChart: PropTypes.bool,
    CustomBarElement: PropTypes.func,
  };

  render() {
    const { data, graphProps, xBand, CustomBarElement, onChangeCategory, defineChart, correctData } = this.props;

    return (
      <Group>
        {(data || []).map((d, index) => (
          <Bar
            value={d.value}
            label={d.label}
            interactive={defineChart || d.interactive}
            defineChart={defineChart}
            xBand={xBand}
            index={index}
            key={`bar-${d.label}-${d.value}-${index}`}
            onChangeCategory={(category) => onChangeCategory(index, category)}
            graphProps={graphProps}
            CustomBarElement={CustomBarElement}
            correctness={d.correctness}
            correctData={correctData}
          />
        ))}
      </Group>
    );
  }
}

export default Plot;
