import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { getAnchor as calcAnchor, distanceBetween, arctangent } from './anchor-utils';
import { Portal } from 'react-portal';
import Point from '@mapbox/point-geometry';
import { parse as parseOrigin } from './transform-origin';
import classNames from 'classnames';

const Anchor = withStyles({
  anchor: {
    position: 'absolute',
    zIndex: 100,
    width: '200px',
    height: '80px'
  }
})(({ classes, left, top, color, fill }) => {
  color = color || 'green';
  fill = fill || 'white';
  return (
    <Portal>
      <svg
        className={classes.anchor}
        style={{
          left: left - 10,
          top: top - 10
        }}
      >
        <circle cx={10} cy={10} r={8} strokeWidth={1} stroke={color} fill={fill} />
      </svg>
    </Portal>
  );
});

/**
 * Tip o' the hat to:
 * https://bl.ocks.org/joyrexus/7207044
 */
export class Rotatable extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    showAnchor: PropTypes.bool,
    handle: PropTypes.arrayOf(
      PropTypes.shape({
        class: PropTypes.string.isRequired,
        origin: PropTypes.string
      })
    ),
    className: PropTypes.string,
    startPosition: PropTypes.shape({
      left: PropTypes.number,
      top: PropTypes.number
    })
  };

  static defaultProps = {
    showAnchor: false,
    startPosition: { left: 0, top: 0 }
  };

  constructor(props) {
    super(props);
    this.state = {
      isRotating: false,
      rotation: 0,
      startAngle: 0,
      angle: 0,
      position: {
        left: props.startPosition.left,
        top: props.startPosition.top
      }
    };
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.rotateStop);
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mousemove', this.rotate);

    this.handles.forEach(h => {
      h.el.removeEventListener('mousedown', h.mousedownHandler);
      h.el.removeEventListener('mouseup', this.rotateStop);
    });
  }

  componentDidMount() {
    this.addMouseUpHandler();
    this.initHandles();
  }

  initHandles = () => {
    const { handle } = this.props;

    if (Array.isArray(handle)) {
      this.handles = [];
      handle.forEach(h => {
        const el = this.rotatable.querySelector(`.${h.class}`);

        if (el) {
          const mousedownHandler = this.rotateStart(h.origin);
          el.addEventListener('mousedown', mousedownHandler);
          el.addEventListener('mouseup', this.rotateStop);
          this.handles.push({ el, mousedownHandler });
        }
      });
    }
  };

  addMouseUpHandler = () => {
    document.addEventListener('mouseup', this.rotateStop);
  };

  originToXY = origin => {
    const { clientWidth: width, clientHeight: height } = this.rotatable;
    return parseOrigin({ width, height }, origin);
  };

  /**
   * Get the anchor point for the given element, origin and rotation.
   * @returns {{left:number, top: number}} - the co-ordinates of the anchor point relative to the whole page.
   */
  getAnchor = origin => {
    const { rotation } = this.state;
    const { clientWidth, clientHeight } = this.rotatable;
    const { top, left } = this.rotatable.getBoundingClientRect();
    const xy = this.originToXY(origin);
    const { top: anchorTop, left: anchorLeft } = calcAnchor(
      {
        width: clientWidth,
        height: clientHeight
      },
      xy,
      rotation
    );

    return {
      top: top + anchorTop,
      left: left + anchorLeft
    };
  };

  rotateStart = origin => e => {
    const { isRotating } = this.state;
    if (isRotating) {
      return;
    }

    e.preventDefault();

    const anchor = this.getAnchor(origin);
    const { rotation } = this.state;
    const { angle: startAngle } = this.getAngle(anchor, e);

    let diff = { x: 0, y: 0 };
    if (origin !== this.state.origin) {
      const { clientWidth: width, clientHeight: height } = this.rotatable;
      diff = distanceBetween({ width, height }, rotation, this.state.origin, origin);
    }

    this.setState(
      {
        origin,
        isRotating: true,
        startAngle,
        anchor,
        position: {
          left: this.state.position.left + diff.x,
          top: this.state.position.top + diff.y
        }
      },
      () => {
        document.addEventListener('mousemove', this.rotate);
      }
    );
  };

  rotateStop = e => {
    const { isRotating } = this.state;

    if (!isRotating) {
      return;
    }

    e.preventDefault();

    this.setState(
      {
        isRotating: false,
        angle: this.state.rotation,
        anchor: null,
        current: null
      },
      () => {
        document.removeEventListener('mousemove', this.rotate);
        document.removeEventListener('mousemove', this.drag);
      }
    );
  };

  getAngle(anchor, e) {
    const x = e.clientX - anchor.left;
    const y = (e.clientY - anchor.top) * -1;
    return { angle: arctangent(x, y), x, y };
  }

  rotate = e => {
    const { isRotating } = this.state;
    if (!isRotating) {
      return;
    }

    e.preventDefault();

    const { startAngle, angle, anchor } = this.state;
    const { angle: current, x, y } = this.getAngle(anchor, e);
    const computedAnchor = { x, y };
    const diff = current - startAngle;
    const rotation = angle + diff;
    this.setState({ rotation, diff, current, computedAnchor });
  };

  mouseDown = e => {
    const handle = this.handles.find(h => h.el === e.target);

    if (!handle) {
      this.dragStart(e);
    }
  };

  dragStart = e => {
    const dragPoint = new Point(e.pageX, e.pageY);
    this.setState({ dragPoint }, () => {
      document.addEventListener('mousemove', this.drag);
    });
  };

  drag = e => {
    e.preventDefault();
    const current = new Point(e.pageX, e.pageY);
    const translate = current.sub(this.state.dragPoint);
    this.setState({ translate });
  };

  mouseUp = () => {
    if (!this.state.translate) {
      return;
    }

    const { position: lastPosition, translate } = this.state;

    const position = {
      left: lastPosition.left + translate.x,
      top: lastPosition.top + translate.y
    };

    document.removeEventListener('mousemove', this.drag);
    this.setState({ position, dragPoint: null, translate: null });
  };

  render() {
    const { children, classes, showAnchor, className } = this.props;
    const { rotation, anchor, origin, translate, position } = this.state;

    const t = translate ? `translate(${translate.x}px, ${translate.y}px)` : '';

    const style = {
      left: position.left,
      top: position.top,
      transformOrigin: origin,
      transform: `${t} rotate(${rotation}deg)`
    };

    return (
      <div
        className={classNames(classes.rotatable, className)}
        style={style}
        ref={r => (this.rotatable = r)}
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
      >
        {anchor && showAnchor && <Anchor {...anchor} />}
        {children}
      </div>
    );
  }
}

export default withStyles({
  rotatable: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'move'
  }
})(Rotatable);
