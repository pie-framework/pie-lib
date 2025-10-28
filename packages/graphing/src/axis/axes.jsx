import React from 'react';
import { Axis } from '@vx/axis';
import { types } from '@pie-lib/plot';
import PropTypes from 'prop-types';
import Arrow from './arrow';
import { styled } from '@mui/material/styles';
import { countWords, findLongestWord, amountToIncreaseWidth, getTickValues } from '../utils';
import { color, Readable } from '@pie-lib/render-ui';

export const AxisPropTypes = {
  includeArrows: PropTypes.object,
  graphProps: PropTypes.object,
};

const AxisDefaultProps = {
  includeArrows: {
    left: true,
    right: true,
    up: true,
    down: true,
  },
};

const StyledArrow = styled(Arrow)(() => ({
  fill: color.defaults.PRIMARY,
}));

const StyledLabel = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize,
}));

const StyledAxisLabelHolder = styled('div')(({ theme }) => ({
  padding: 0,
  margin: 0,
  textAlign: 'center',
  '* > *': {
    margin: 0,
    padding: 0,
  },
  fontSize: theme.typography.fontSize,
}));

const StyledAxesGroup = styled('g')(() => ({
  '& .vx-axis-line': {
    stroke: color.defaults.PRIMARY,
    strokeWidth: 3,
  },
  '& .vx-axis-tick': {
    fill: color.defaults.PRIMARY,
    '& line': {
      stroke: color.defaults.PRIMARY,
    },
  },
}));

const tickLabelStyles = {
  fontFamily: 'Roboto',
  fontSize: '14px',
  cursor: 'inherit',
};

export const sharedValues = (
  firstNegativeX,
  firstNegativeY,
  distanceFromOriginToFirstNegativeX,
  distanceFromOriginToFirstNegativeY,
  deltaAllowance,
  dy,
) => {
  let result = [];

  if (
    firstNegativeX === firstNegativeY &&
    distanceFromOriginToFirstNegativeX - deltaAllowance < distanceFromOriginToFirstNegativeY &&
    distanceFromOriginToFirstNegativeY < distanceFromOriginToFirstNegativeX + deltaAllowance &&
    distanceFromOriginToFirstNegativeX - deltaAllowance < dy &&
    dy < distanceFromOriginToFirstNegativeX + deltaAllowance
  ) {
    result.push(firstNegativeX);
  }

  return result;
};

export const firstNegativeValue = (interval) => (interval || []).find((element) => element < 0);

export class RawXAxis extends React.Component {
  static propTypes = {
    ...AxisPropTypes,
    graphProps: types.GraphPropsType.isRequired,
  };
  static defaultProps = AxisDefaultProps;

  render() {
    const {
      includeArrows,
      graphProps,
      columnTicksValues,
      skipValues,
      distanceFromOriginToFirstNegativeY,
      dy,
    } = this.props;
    const { scale, domain, size, range } = graphProps || {};

    // Having 0 as a number in columnTicksValues does not make 0 to show up
    // so we use this trick, by defining it as a string:
    const tickValues =
      (domain.labelStep || range.labelStep) && domain.min <= 0 ? ['0', ...columnTicksValues] : columnTicksValues;
    // However, the '0' has to be displayed only if other tick labels (y-axis or x-axis) are displayed

    const labelProps = (label) => {
      const y = skipValues && skipValues[0] === label ? distanceFromOriginToFirstNegativeY + 4 : dy;

      return {
        ...tickLabelStyles,
        textAnchor: 'middle',
        y: y,
        dx: label === '0' ? -10 : 0,
        dy: label === '0' ? -7 : 0,
      };
    };

    const necessaryRows = countWords(domain.axisLabel);
    const longestWord = findLongestWord(domain.axisLabel);
    const necessaryWidth = amountToIncreaseWidth(longestWord) + 2;

    return (
      <StyledAxesGroup>
        <Axis
          scale={scale.x}
          top={scale.y(0)}
          left={0}
          label={domain.label}
          rangePadding={8}
          tickFormat={(value) => value}
          tickLabelProps={labelProps}
          tickValues={tickValues}
        />
        {includeArrows && includeArrows.left && (
          <StyledArrow direction="left" x={domain.min} y={0} scale={scale} />
        )}
        {includeArrows && includeArrows.right && (
          <StyledArrow direction="right" x={domain.max} y={0} scale={scale} />
        )}
        {domain.axisLabel && (
          <foreignObject x={size.width + 17} y={scale.y(0) - 9} width={necessaryWidth} height={20 * necessaryRows}>
            <StyledLabel dangerouslySetInnerHTML={{ __html: domain.axisLabel }} />
          </foreignObject>
        )}
      </StyledAxesGroup>
    );
  }
}

const XAxis = RawXAxis;

export class RawYAxis extends React.Component {
  static propTypes = {
    ...AxisPropTypes,
    graphProps: types.GraphPropsType.isRequired,
  };
  static defaultProps = AxisDefaultProps;

  render() {
    const { includeArrows, graphProps, skipValues, rowTickValues } = this.props;
    const { scale, range, size } = graphProps || {};

    const necessaryWidth = range.axisLabel ? amountToIncreaseWidth(range.axisLabel.length) : 0;

    const customTickFormat = (value) => (skipValues && skipValues.indexOf(value) >= 0 ? '' : value);

    return (
      <StyledAxesGroup>
        <Axis
          orientation={'left'}
          scale={scale.y}
          top={0}
          height={size.height}
          left={scale.x(0)}
          label={range.label}
          labelProps={{ 'data-pie-readable': false }}
          rangePadding={8}
          tickLength={10}
          tickFormat={customTickFormat}
          tickLabelProps={(value) => {
            let digits = value.toLocaleString().replace(/[.-]/g, '').length || 1;

            return {
              ...tickLabelStyles,
              dy: 4,
              dx: -10 - digits * 9,
              'data-pie-readable': false,
            };
          }}
          hideZero={true}
          tickTextAnchor={'bottom'}
          tickValues={rowTickValues}
        />
        {includeArrows && includeArrows.down && (
          <StyledArrow direction="down" x={0} y={range.min} scale={scale} />
        )}
        {includeArrows && includeArrows.up && (
          <StyledArrow direction="up" x={0} y={range.max} scale={scale} />
        )}
        {range.axisLabel && (
          <foreignObject x={scale.x(0) - necessaryWidth / 2} y={-33} width={necessaryWidth} height="20">
            <Readable false>
              <StyledAxisLabelHolder dangerouslySetInnerHTML={{ __html: range.axisLabel }} />
            </Readable>
          </foreignObject>
        )}
      </StyledAxesGroup>
    );
  }
}

const YAxis = RawYAxis;

export default class Axes extends React.Component {
  static propTypes = {
    ...AxisPropTypes,
    graphProps: types.GraphPropsType.isRequired,
  };
  static defaultProps = AxisDefaultProps;

  xValues = () => {
    const { graphProps } = this.props;
    const { scale, domain } = graphProps || {};

    if (!domain || !scale) {
      return;
    }

    const ticks = getTickValues({ ...domain, step: domain.labelStep });
    const negative = firstNegativeValue(ticks);

    return {
      columnTicksValues: ticks,
      firstNegativeX: negative,
      distanceFromOriginToFirstNegativeX: Math.abs(scale.y(0) - scale.y(negative)),
    };
  };

  yValues = () => {
    const { graphProps } = this.props;
    const { scale, range } = graphProps || {};

    if (!range || !scale) {
      return;
    }

    const ticks = getTickValues({ ...range, step: range.labelStep });
    const negative = firstNegativeValue(ticks);

    return {
      rowTickValues: ticks,
      firstNegativeY: negative,
      distanceFromOriginToFirstNegativeY: Math.abs(scale.x(0) - scale.x(negative)),
    };
  };

  render() {
    const { graphProps } = this.props;
    const { domain, range } = graphProps || {};
    const { columnTicksValues, firstNegativeX, distanceFromOriginToFirstNegativeX } = this.xValues();
    const { rowTickValues, firstNegativeY, distanceFromOriginToFirstNegativeY } = this.yValues();
    const deltaAllowance = 6;
    const dy = 25;

    const skipValues = sharedValues(
      firstNegativeX,
      firstNegativeY,
      distanceFromOriginToFirstNegativeX,
      distanceFromOriginToFirstNegativeY,
      deltaAllowance,
      dy,
    );

    // each axis has to be displayed only if the domain & range include it
    return (
      <StyledAxesGroup>
        {range.min <= 0 ? (
          <XAxis
            {...this.props}
            skipValues={skipValues}
            columnTicksValues={columnTicksValues}
            distanceFromOriginToFirstNegativeY={distanceFromOriginToFirstNegativeY}
            dy={dy}
          />
        ) : null}
        {domain.min <= 0 ? (
          <YAxis
            {...this.props}
            skipValues={skipValues}
            rowTickValues={rowTickValues}
            distanceFromOriginToFirstNegativeX={distanceFromOriginToFirstNegativeX}
          />
        ) : null}
      </StyledAxesGroup>
    );
  }
}
