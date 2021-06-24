import React from 'react';
import { Group } from '@vx/group';
import { LinePath } from '@vx/shape';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import DraggableHandle, { DragHandle } from './drag-handle';
import { withStyles } from '@material-ui/core/styles/index';
import isEqual from 'lodash/isEqual';
import { color } from '@pie-lib/render-ui';

const getData = (data, domain) => {
  const { max } = domain || {};
  const length = data.length;

  if (!max || !length) {
    return [];
  }

  return data.map((el, i) => ({
    ...el,
    x: length > 1 ? i * (max / (length - 1)) : 0.5,
    y: el.value
  }));
};

export class RawLine extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    classes: PropTypes.object,
    label: PropTypes.string,
    xBand: PropTypes.func,
    index: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.number
      })
    ),
    CustomDraggableComponent: PropTypes.func
  };

  static defaultProps = {
    index: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      dragValue: undefined,
      line: getData(props.data, props.graphProps.domain)
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.setState({
        line: getData(nextProps.data, nextProps.graphProps.domain)
      });
    }
  }

  setDragValue = line => this.setState({ line });

  dragStop = index => {
    const { onChange } = this.props;
    this.setState({ dragging: false }, () => {
      onChange(index, this.state.line[index]);
    });
  };

  dragValue = (index, existing, next) => {
    const newLine = [...this.state.line];
    newLine[index].dragValue = next;
    this.setDragValue(newLine);
  };

  render() {
    const { graphProps, data, classes, CustomDraggableComponent } = this.props;
    const { line: lineState, dragging } = this.state;
    const { scale } = graphProps;
    const lineToUse = dragging ? lineState : getData(data, graphProps.domain);

    return (
      <React.Fragment>
        <LinePath
          data={lineToUse}
          x={d => scale.x(d.x)}
          y={d => scale.y(d.dragValue !== undefined ? d.dragValue : d.y)}
          className={classes.line}
        />
        {lineToUse &&
          lineToUse.map((point, i) => {
            const r = 6;
            const Component = point.interactive ? DraggableHandle : DragHandle;

            return (
              <Component
                key={`point-${point.x}-${i}`}
                x={point.x}
                y={point.dragValue !== undefined ? point.dragValue : point.y}
                interactive={point.interactive}
                r={r}
                onDragStart={() => this.setState({ dragging: true })}
                onDrag={v =>
                  this.dragValue(i, point.dragValue !== undefined ? point.dragValue : point.y, v)
                }
                onDragStop={() => this.dragStop(i)}
                graphProps={graphProps}
                CustomDraggableComponent={CustomDraggableComponent}
                correctness={point.correctness}
              />
            );
          })}
      </React.Fragment>
    );
  }
}

const StyledLine = withStyles(theme => ({
  line: {
    fill: 'transparent',
    stroke: color.primaryLight(),
    strokeWidth: 3,
    transition: 'stroke 200ms ease-in, stroke-width 200ms ease-in',
    '&:hover': {
      strokeWidth: 6,
      stroke: color.primaryDark()
    }
  }
}))(RawLine);

export class Line extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    xBand: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired
  };

  changeLine = (index, category) => {
    const { onChange } = this.props;
    const newLine = [...this.props.data];
    const { dragValue, value } = category;

    newLine[index].value = dragValue >= 0 ? dragValue : value;

    onChange(newLine);
  };

  render() {
    const props = this.props;

    return (
      <Group>
        <StyledLine {...props} onChange={this.changeLine} />
      </Group>
    );
  }
}

export default Line;
