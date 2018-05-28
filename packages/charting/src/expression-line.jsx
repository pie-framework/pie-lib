import React from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { ContextTypes } from './domain-and-range';
import { Point as VxPoint } from '@vx/point';
import { Line } from '@vx/shape';
import { LineType } from './charting-types';
import { utils } from './line';
import Point, { utils as pointUtils } from './point';
import injectSheet from 'react-jss';
import classNames from 'classnames';

const log = debug('pie-lib:charting:expression-line');

export class ExpressionLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null
    };
  }

  static propTypes = {
    range: PropTypes.object.isRequired,
    domain: PropTypes.object.isRequired,
    line: LineType,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
  };

  static contextTypes = ContextTypes();

  buildExtendedLine(line) {
    const { scale } = this.context;
    const { domain } = this.props;
    const expression = utils.expression(line.from, line.to);

    const fromX = expression.isVerticalLine ? line.from.x : domain.min;
    const toX = expression.isVerticalLine ? line.to.x : domain.max;

    const fromY = expression.getY(domain.min);
    const toY = expression.getY(domain.max);

    return {
      from: new VxPoint({
        x: scale.x(fromX),
        y: scale.y(fromY)
      }),
      to: new VxPoint({
        x: scale.x(toX),
        y: scale.y(toY)
      })
    };
  }

  onDragPoint = (fromOrTo, p) => {
    log('[onDragPoint]: p: ', p);
    const preview = { ...this.props.line, [fromOrTo]: p };
    this.setState({ preview });
  };

  onDragFrom = p => this.onDragPoint('from', p);

  onDragTo = p => this.onDragPoint('to', p);

  onMovePoint = (fromOrTo, p) => {
    const { onChange } = this.props;
    log('[onMovePoint]: p: ', p);
    this.setState({ preview: null });
    onChange({ ...this.props.line, [fromOrTo]: p });
  };

  onMoveFrom = p => this.onMovePoint('from', p);

  onMoveTo = p => this.onMovePoint('to', p);

  onClick = () => {
    const { onClick } = this.props;
    onClick(this.props.line);
  };

  render() {
    const { line, domain, range, classes, selected } = this.props;
    const { preview } = this.state;

    log('[render] preview:', preview);

    const l = preview || line;

    const points = this.buildExtendedLine(l, domain, range);
    return (
      <g>
        <Line
          stroke={'black'}
          className={classNames(
            preview && classes.preview,
            selected && classes.selected
          )}
          strokeWidth={2}
          from={points.from}
          to={points.to}
        />
        <Point
          showCoordinates={true}
          x={line.from.x}
          y={line.from.y}
          disabled={false}
          empty={false}
          onDrag={this.onDragFrom}
          onMove={this.onMoveFrom}
          onClick={this.onClick}
          selected={selected}
          bounds={pointUtils.bounds(line.from, domain, range)}
          interval={1}
        />
        <Point
          showCoordinates={true}
          x={line.to.x}
          y={line.to.y}
          disabled={false}
          empty={false}
          onDrag={this.onDragTo}
          onMove={this.onMoveTo}
          onClick={this.onClick}
          selected={selected}
          bounds={pointUtils.bounds(line.to, domain, range)}
          interval={1}
        />
      </g>
    );
  }
}

const styles = {
  preview: {
    stroke: 'rgba(0,0,0, 0.2)',
    strokeWidth: 4
  },
  selected: {
    stroke: 'rgba(0,0,255, 0.2)'
  }
};

export default injectSheet(styles)(ExpressionLine);
