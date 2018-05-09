import React from 'react';
import PropTypes from 'prop-types';
import Draggable from './draggable';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { ContextTypes } from '../domain-and-range';
import debug from 'debug';
import * as utils from './utils';

import { correct, incorrect, primary } from '../color';

export { utils };

const log = debug('pie-lib:charting:point');

const duration = '150ms';

const style = {
  point: {
    '& circle': {
      cursor: 'pointer',
      transition: `r ${duration} linear,  
    opacity ${duration} linear, 
    fill ${duration} linear,
    stroke ${duration} linear`,
      stroke: 'var(--point-stroke, black)',
      fill: 'var(--point-stroke, black)'
    },
    '& text': {
      transition: `opacity ${duration} linear`
    },
    '&.react-draggable-dragging text': {
      opacity: 0
    },
    '&.react-draggable-dragging circle': {
      opacity: 0.25,
      r: '10px'
    }
  },
  disabled: {
    '& circle': {
      cursor: 'inherit',
      fill: 'var(--charting-point-fill, grey)',
      stroke: 'var(--charting-point-fill, grey)'
    }
  },
  selected: {
    '& text': {
      fill: primary.main
    },
    '& circle': {
      stroke: primary.main,
      fill: primary.main
    }
  },
  correct: {
    '& circle': {
      cursor: 'inherit',
      stroke: correct.main,
      fill: correct.main
    }
  },
  incorrect: {
    '& circle': {
      cursor: 'inherit',
      stroke: incorrect.main,
      fill: incorrect.main
    }
  },
  empty: {
    fill: 'var(--point-fill, white)'
  }
};

class Label extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    label: PropTypes.string,
    showCoordinates: PropTypes.bool
  };

  static contextTypes = ContextTypes();

  render() {
    const { x, y, label, showCoordinates } = this.props;
    const { scale } = this.context;
    const xy = showCoordinates ? `(${x},${y})` : '';
    const value = label ? `${label} ${xy}` : xy;
    return (
      <text x={scale.x(x)} y={scale.y(y) - 10}>
        {value}
      </text>
    );
  }
}
/**
 * TODO: publish this and use it in @pie-ui/number-line.
 */
export class Point extends React.Component {
  static defaultProps = {
    selected: false,
    empty: false,
    disabled: false,
    correct: undefined,
    label: undefined,
    showLabels: true,
    showCoordinates: false
  };

  static propTypes = {
    interval: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    bounds: PropTypes.shape({
      left: PropTypes.number.isRequired,
      right: PropTypes.number.isRequired
    }),
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    correct: PropTypes.bool,
    empty: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onMove: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    onDrag: PropTypes.func,
    onDragStop: PropTypes.func,
    onDragStart: PropTypes.func,
    label: PropTypes.string,
    showLabels: PropTypes.bool,
    showCoordinates: PropTypes.bool
  };

  static contextTypes = ContextTypes();

  render() {
    const {
      x,
      y,
      onDragStop,
      onDragStart,
      onDrag: onDragCallback,
      onClick,
      onMove,
      interval,
      bounds,
      selected,
      disabled,
      correct,
      empty,
      classes,
      showLabels,
      showCoordinates,
      label
    } = this.props;

    const { scale, snap } = this.context;

    const grid = {
      x: scale.x(interval) - scale.x(0),
      y: scale.y(interval) - scale.y(0)
    };

    log('[render] bounds: ', bounds, 'grid: ', grid);

    const position = {
      x: delta => {
        const normalized = delta + scale.x(0);
        const inverted = scale.x.invert(normalized);
        return snap.x(x + inverted);
      },
      y: delta => {
        const normalized = delta + scale.y(0);
        const inverted = scale.y.invert(normalized);
        return snap.y(y + inverted);
      }
    };

    const onStart = e => {
      this.setState({ startX: e.clientX, startY: e.clientY });
      if (onDragStart) {
        onDragStart();
      }
    };

    const tiny = (key, event) => {
      const K = key.toUpperCase();
      const end = event[`client${K}`];
      const start = this.state[`start${K}`];
      const delta = Math.abs(end - start);
      const out = delta < Math.abs(grid[key]) / 10;
      log('[tiny] key: ', key, 'delta: ', delta, 'out: ', out);
      return out;
    };

    const onStop = (e, dd) => {
      if (onDragStop) {
        onDragStop();
      }

      if (tiny('x', e) && tiny('y', e)) {
        // if (deltaX < (xGrid / 10)) {
        if (onClick) {
          onClick();
          this.setState({ startX: null });
        }
      } else {
        const newPosition = {
          x: position.x(dd.lastX),
          y: position.y(dd.lastY)
        };

        log('[onStop] new pos: ', newPosition);
        onMove(newPosition);
      }
    };

    //prevent the text select icon from rendering.
    const onMouseDown = e => e.nativeEvent.preventDefault();

    const scaledBounds = {
      left: bounds.left / interval * grid.x,
      right: bounds.right / interval * grid.x,
      top: bounds.top / interval * grid.y,
      bottom: bounds.bottom / interval * grid.y
    };

    const onDrag = (e, dd) => {
      const p = {
        x: position.x(dd.x),
        y: position.y(dd.y)
      };
      if (onDragCallback) {
        onDragCallback(p);
      }
    };

    const circleClass = classNames(classes.point, {
      [classes.selected]: selected,
      [classes.correct]: correct === true,
      [classes.incorrect]: correct === false,
      [classes.empty]: empty === true,
      [classes.disabled]: disabled
    });

    return (
      <Draggable
        disabled={disabled}
        onMouseDown={onMouseDown}
        onStart={onStart}
        onDrag={onDrag}
        onStop={onStop}
        axis="both"
        grid={[grid.x, grid.y]}
        bounds={scaledBounds}
      >
        <g className={circleClass}>
          {((showLabels && label) || showCoordinates) && (
            <Label
              showCoordinates={showCoordinates}
              x={x}
              y={y}
              label={showLabels ? label : null}
            />
          )}
          <circle r="5" strokeWidth="3" cx={scale.x(x)} cy={scale.y(y)} />
        </g>
      </Draggable>
    );
  }
}

export default injectSheet(style)(Point);
