import React from 'react';
import { Group } from '@vx/group';
import { LinePath } from '@vx/shape';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import DragHandle from './drag-handle';
import { withStyles } from '@material-ui/core/styles/index';

const getData = (data, domain) => {
  const { max } = domain || {};
  const length = data.length;

  if (!max || !length) {
    return [{ x: 0, y: 0 }];
  }

  return data.map((el, i) => ({
    x: i * (max / (length - 1)),
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
    data: PropTypes.arrayOf({
      label: PropTypes.string,
      value: PropTypes.number
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      dragValue: undefined,
      line: getData(props.data, props.graphProps.domain)
    };
  }

  setDragValue = line => this.setState({ line });

  dragStop = index => {
    const { onChange } = this.props;
    this.setState({ dragging: false }, () => {
      const newLine = [...this.props.data];
      newLine[index].value = this.state.line[index].dragValue;
      onChange(newLine);
    });
  };

  dragValue = (index, existing, next) => {
    const newLine = [...this.state.line];
    newLine[index].dragValue = next;
    this.setDragValue(newLine);
  };

  render() {
    const { graphProps, data, classes } = this.props;
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
            const r = 5;

            return (
              <DragHandle
                key={`point-${point.x}-${i}`}
                x={point.x}
                y={point.dragValue !== undefined ? point.dragValue : point.y}
                r={r}
                onDragStart={() => this.setState({ dragging: true })}
                onDrag={v =>
                  this.dragValue(i, point.dragValue !== undefined ? point.dragValue : point.y, v)
                }
                onDragStop={() => this.dragStop(i)}
                graphProps={graphProps}
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
    stroke: theme.palette.primary.light,
    strokeWidth: 3,
    transition: 'stroke 200ms ease-in, stroke-width 200ms ease-in',
    '&:hover': {
      strokeWidth: 6,
      stroke: theme.palette.primary.dark
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

  changeLine = nextData => {
    const { onChange } = this.props;

    onChange(nextData);
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
