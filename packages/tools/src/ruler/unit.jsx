import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { noSelect, strokeColor } from '../style-utils';
import range from 'lodash/range';

const StyledTick = styled('line')(({ theme }) => ({
  stroke: strokeColor(theme),
}));

const Tick = ({ x, height, bottom, major, minor }) => {
  const y1 = major ? bottom - height * 2 : minor ? bottom - height * 1.5 : bottom - height;

  return <StyledTick y1={y1} y2={bottom} x1={x} x2={x} />;
};

const Ticks = ({ count, width, height }) => {
  return (
    <React.Fragment>
      {range(1, count).map((r) => {
        return (
          <Tick
            key={r}
            value={r}
            x={r * (width / count)}
            major={r % (count / 2) === 0}
            minor={r % (count / 4) === 0}
            bottom={height}
            height={10}
          />
        );
      })}
    </React.Fragment>
  );
};

Ticks.propTypes = {
  count: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const StyledEndTick = styled('line')(({ theme }) => ({
  stroke: strokeColor(theme),
  strokeWidth: 1,
}));

const StyledLabel = styled('text')(({ theme }) => ({
  textAnchor: 'end',
  fontSize: '12px',
  fill: strokeColor(theme),
  ...noSelect(),
}));

export class Unit extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    last: PropTypes.bool.isRequired,
    config: PropTypes.object.isRequired,
  };

  render() {
    const { index, width, height, last, config } = this.props;

    const style = {
      transform: `translate(${width * (index - 1)}px, 0px)`,
    };
    return (
      <g style={style}>
        {!last && <StyledEndTick x1={width} y1={0} x2={width} y2={height} />}

        <Ticks count={config.ticks} width={width} height={height} />
        <StyledLabel width={width} x={width - 5} y={15}>
          {index}
        </StyledLabel>
      </g>
    );
  }
}

export default Unit;
