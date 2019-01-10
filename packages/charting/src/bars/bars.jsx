import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { Group } from '@vx/group';
import { Bar as VxBar } from '@vx/shape';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import DragHandle from './drag-handle';
import debug from 'debug';
import { dataToXBand, bandKey } from '../utils';

const log = debug('pie-lib:chart:bars');

class RawBar extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    classes: PropTypes.object,
    label: PropTypes.string,
    xBand: PropTypes.func,
    index: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      dragValue: undefined
    };
  }

  changeValue = (existing, next) => {
    const { onChange, label } = this.props;
    log('[changeValue]', existing, next);
    onChange({ label, value: next });
  };

  dragValue = (existing, next) => {
    log('[dragValue] next:', next);
    this.setState({ dragValue: next });
  };

  render() {
    const { graphProps, value, label, classes, xBand, index } = this.props;
    const { scale, range } = graphProps;
    const { dragValue } = this.state;

    const v = Number.isFinite(dragValue) ? dragValue : value;
    const barWidth = xBand.bandwidth();
    const barHeight = scale.y(range.max - v);
    const barX = xBand(bandKey({ label }, index));
    const rawY = range.max - v;
    const yy = range.max - rawY;
    log(
      'label:',
      label,
      'barX:',
      barX,
      'v: ',
      v,
      'barHeight:',
      barHeight,
      'barWidth: ',
      barWidth
    );
    return (
      <React.Fragment>
        <VxBar
          x={barX}
          y={scale.y(yy)}
          width={barWidth}
          height={barHeight}
          className={classes.bar}
        />
        <DragHandle
          x={barX}
          y={value}
          width={barWidth}
          onMove={v => this.changeValue(value, v)}
          onDrag={v => this.dragValue(value, v)}
          onDragStop={() => this.setState({ dragValue: undefined })}
          graphProps={graphProps}
        />
      </React.Fragment>
    );
  }
}

const Bar = withStyles(theme => ({
  bar: {
    fill: fade(theme.palette.primary.main, 0.2)
  }
}))(RawBar);

export class Bars extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired
  };

  changeBar = (index, next) => {
    const { data, onChange } = this.props;

    if (index >= 0) {
      const update = [...data];
      update.splice(index, 1, next);
      onChange(update);
    }
  };

  render() {
    const { data, graphProps } = this.props;
    const { scale, size } = graphProps;
    const xBand = dataToXBand(scale.x, data, size.width);
    return (
      <Group>
        {(data || []).map((d, index) => (
          <Bar
            value={d.value}
            label={d.label}
            xBand={xBand}
            index={index}
            key={`bar-${d.label}-${d.value}-${index}`}
            onChange={next => this.changeBar(index, next)}
            graphProps={graphProps}
          />
        ))}
      </Group>
    );
  }
}

export default Bars;
