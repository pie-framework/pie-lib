import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';
import { color, Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import cn from 'classnames';

const rotations = {
  left: -90,
  top: 0,
  bottom: 0,
  right: 90
};

export const getTransform = (side, width, height) => {
  const t = (x, y, rotate) => `translate(${x}, ${y}), rotate(${rotate})`;

  if (side === 'left') {
    return t(-20, height / 2, rotations[side]);
  }

  if (side === 'bottom') {
    return t(width / 2, height + 30, rotations[side]);
  }
};

const getY = (side, height) => {
  switch (side) {
    case 'left':
      return -height + 6;
    case 'top':
      return -height + 6;
    case 'right':
      return -height;
    default:
      return -height - 15;
  }
};

class RawLabel extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    side: PropTypes.string,
    classes: PropTypes.object,
    disabledLabel: PropTypes.bool,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { disabledLabel, text, side, graphProps, classes, onChange } = this.props;
    const { size, domain, range } = graphProps;
    const totalHeight = (size.height || 500) + (range.padding || 0) * 2;
    const totalWidth = (size.width || 500) + (domain.padding || 0) * 2;

    const transform = getTransform(side, totalWidth, totalHeight);
    const width = side === 'left' || side === 'right' ? totalHeight : totalWidth;
    const height = 36;
    const y = getY(side, height);

    const activePlugins = [
      'bold',
      'italic',
      'underline',
      'strikethrough'
      // 'languageCharacters'
    ];

    return (
      <foreignObject
        x={-(width / 2)}
        y={y}
        width={width}
        height={height * 2}
        transform={transform}
        textAnchor="middle"
      >
        <Readable false>
          <EditableHtml
            className={cn(
              {
                [classes.bottomLabel]: side === 'bottom',
                [classes.disabledAxisLabel]: disabledLabel
              },
              classes.axisLabel
            )}
            markup={text || ''}
            onChange={onChange}
            placeholder={!disabledLabel && `Click here to add a ${side} label`}
            toolbarOpts={{
              position: side === 'bottom' ? 'top' : 'bottom',
              noBorder: true
            }}
            activePlugins={activePlugins}
          />
        </Readable>
      </foreignObject>
    );
  }
}

const Label = withStyles(theme => ({
  label: {
    fill: color.secondary()
  },
  axisLabel: {
    fontSize: theme.typography.fontSize - 2,
    textAlign: 'center'
  },
  disabledAxisLabel: {
    pointerEvents: 'none'
  },
  bottomLabel: {
    marginTop: '60px'
  }
}))(RawLabel);

export const LabelType = {
  left: PropTypes.string,
  top: PropTypes.string,
  bottom: PropTypes.string,
  right: PropTypes.string
};

export class Labels extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    disabledLabels: PropTypes.bool,
    value: PropTypes.shape(LabelType),
    graphProps: PropTypes.object
  };

  static defaultProps = {};

  onChangeLabel = (newValue, side) => {
    const { value, onChange } = this.props;
    const labels = {
      ...value,
      [side]: newValue
    };

    onChange(labels);
  };

  render() {
    const { disabledLabels, value = {}, graphProps } = this.props;

    return (
      <React.Fragment>
        <Label
          key="left"
          side="left"
          text={value.left}
          disabledLabel={disabledLabels}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'left')}
        />
        <Label
          key="bottom"
          side="bottom"
          text={value.bottom}
          disabledLabel={disabledLabels}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'bottom')}
        />
      </React.Fragment>
    );
  }
}

export default Labels;
