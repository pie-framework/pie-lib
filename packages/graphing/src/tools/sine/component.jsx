import React from 'react';
import PropTypes from 'prop-types';
import { ToolPropType } from '../types';
import debug from 'debug';
import { types } from '@pie-lib/plot';
import { LinePath } from '@vx/shape';
import { Group } from '@vx/group';
import { curveMonotoneX, curveNatural } from '@vx/curve';
// import { genDateValue } from '@vx/mock-data';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';

const genDateValue = () => ({});
const xy = (x, y) => ({ x, y });

const log = debug('pie-lib:graphing:sine');

log('sine...');

function genLines(num) {
  return new Array(num).fill(1).map(() => {
    return genDateValue(25);
  });
}

const series = genLines(12);
const data = series.reduce((rec, d) => {
  return rec.concat(d);
}, []);

// accessors
const x = d => d.date;
const y = d => d.value;

const Sample = ({ width, height }) => {
  // bounds
  const xMax = width;
  const yMax = height / 8;

  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, x)
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(data, y)]
  });

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#242424" rx={14} />
      {xMax > 8 &&
        series.map((d, i) => {
          return (
            <Group key={`lines-${i}`} top={(i * yMax) / 2}>
              <LinePath
                data={d}
                x={d => xScale(x(d))}
                y={d => yScale(y(d))}
                stroke={'#ffffff'}
                strokeWidth={1}
                curve={i % 2 == 0 ? curveMonotoneX : undefined}
              />
            </Group>
          );
        })}
    </svg>
  );
};

const Sine = ({ root, edge, graphProps }) => {
  log('graphProps', graphProps);

  // M0,0 L 100,100 L 300,200
  const data = [
    // xy(-6, -1),
    // xy(-5, 1),
    // xy(-4, -1),
    xy(-3, 1),
    xy(-2, -1),
    xy(-1, 1),
    xy(0, -1),
    xy(1, 1),
    xy(2, -1),
    xy(3, 1),
    xy(4, -1),
    xy(5, 1),
    xy(6, -1)
  ];
  const raw = data.map(d => [graphProps.scale.x(d.x), graphProps.scale.y(d.y)]);
  console.log('raw:', raw);
  return (
    <LinePath
      xScale={d => {
        console.log('>>>>', d);
        return graphProps.scale.x(d.x);
      }}
      ySCale={d => graphProps.scale.y(d.y)}
      stroke={'green'}
      strokeWidth={2}
      data={raw}
      curve={curveMonotoneX}
    />
  );
};

export default class Component extends React.Component {
  static propTypes = {
    ...ToolPropType,
    graphProps: types.GraphPropsType.isRequired,
    foo: PropTypes.string
  };

  static defaultProps = {};

  render() {
    const { mark, graphProps } = this.props;
    return <Sine root={mark.root} edge={mark.edge} graphProps={graphProps} />;
  }
}
