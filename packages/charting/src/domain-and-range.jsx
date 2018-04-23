import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@vx/grid';
import { Axis } from '@vx/axis';
import invariant from 'invariant';
import { scaleLinear } from 'd3-scale';
import { AxisType } from './charting-types';
import { buildSizeArray, tickCount } from './utils';
import { snapTo } from './utils';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import Arrow from './arrow';

import { select, mouse } from 'd3-selection';

export function ContextTypes() {
  return {
    scale: PropTypes.shape({
      x: PropTypes.func.isRequired,
      y: PropTypes.func.isRequired
    }).isRequired,
    snap: PropTypes.shape({
      x: PropTypes.func.isRequired,
      y: PropTypes.func.isRequired
    }).isRequired
  };
}

export class DomainAndRange extends React.Component {
  static childContextTypes = ContextTypes();

  static propTypes = {
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    domain: AxisType.isRequired,
    range: AxisType.isRequired,
    onClick: PropTypes.func
  };

  getScaleFunctions() {
    const { domain, range, width, height } = this.props;

    invariant(domain.min < domain.max, 'domain: min must be less than max');
    invariant(range.min < range.max, 'range: min must be less than max');

    const widthArray = buildSizeArray(width, domain.padding);
    const heightArray = buildSizeArray(height, range.padding);

    const scale = {
      x: scaleLinear()
        .domain([domain.min, domain.max])
        .range(widthArray),
      y: scaleLinear()
        .domain([range.max, range.min])
        .range(heightArray)
    };

    const snap = {
      x: snapTo.bind(null, domain.min, domain.max, 1),
      y: snapTo.bind(null, range.min, range.max, 1)
    };

    return { scale, snap };
  }

  getChildContext() {
    return this.getScaleFunctions();
  }

  /**
   * Note: we use d3 click + mouse to give us domain values directly.
   * Saves us having to calculate them ourselves from a MouseEvent.
   */
  onRectClick(rect) {
    let { disabled, onClick } = this.props;

    if (disabled) {
      return;
    }

    if (!onClick) {
      return;
    }

    //TODO: should minimize calls to this function - should only rebuild on props update
    const { scale } = this.getScaleFunctions();
    const coords = mouse(rect._groups[0][0]);
    const x = scale.x.invert(coords[0]);
    const y = scale.y.invert(coords[1]);
    onClick({ x, y });
  }

  componentDidMount() {
    const rect = select(this.rect);
    rect.on('click', this.onRectClick.bind(this, rect));
  }

  render() {
    const {
      classes,
      domain,
      range,
      width,
      height,
      children,
      title,
      disabled
    } = this.props;
    const { scale } = this.getScaleFunctions();

    return (
      <div>
        {title && <h4 className={classes.title}>{title}</h4>}
        <svg
          width={width}
          height={height}
          className={classNames(classes.svg, disabled && classes.disabled)}
        >
          <Grid
            xScale={scale.x}
            yScale={scale.y}
            width={width}
            height={height}
            numTicksRows={tickCount(domain.min, domain.max, domain.step)}
            stroke={disabled ? 'rgba(236, 239, 241, 0.5)' : 'rgb(236, 239, 241)'}
            numTicksColumns={tickCount(range.min, range.max, domain.step)}
          />
          <Axis
            orientation={'left'}
            scale={scale.y}
            top={0}
            height={height}
            left={scale.x(0)}
            numTicks={tickCount(range.min, range.max, range.step)}
            stroke={`rgba(144, 164, 174, ${disabled ? '0.3' : '1'})`}
            strokeWidth={2}
            label={range.label}
            tickTextFill={'red'}
            tickTextDy={10}
            hideZero={true}
            tickTextFontSize={20}
            tickText={{
              fontSize: 20
            }}
            tickTextAnchor={'bottom'}
          />
          <Axis
            hideZero={true}
            scale={scale.x}
            numTicks={tickCount(domain.min, domain.max, domain.step)}
            top={scale.y(0)}
            left={0}
            stroke={`rgba(144, 164, 174, ${disabled ? '0.5' : '1'})`}
            strokeWidth={2}
            label={domain.label}
            tickTextFill={'#1b1a1e'}
          />
          <rect
            ref={rect => (this.rect = rect)}
            //need to have a fill for it to be clickable
            fill="red"
            fillOpacity="0.0"
            width={width}
            height={height}
          />

          <Arrow x={width / 2} y={0} className={classes.arrow} direction={'up'} />
          <Arrow
            x={width / 2}
            y={height}
            className={classes.arrow}
            direction={'down'}
          />
          <Arrow
            x={width}
            y={height / 2}
            direction="right"
            className={classes.arrow}
          />
          <Arrow x={0} y={height / 2} className={classes.arrow} />
          <Arrow
            x={width}
            y={height / 2}
            direction="right"
            className={classes.arrow}
          />
          {children}
        </svg>
      </div>
    );
  }
}

const styles = {
  title: {
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    marginTop: '0'
  },
  svg: {
    cursor: 'pointer'
  },
  disabled: {
    cursor: 'inherit'
  },
  arrow: {
    fill: 'rgb(144, 164, 174)'
  }
};

export default injectSheet(styles)(DomainAndRange);
