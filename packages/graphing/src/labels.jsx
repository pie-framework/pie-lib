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
  if (side === 'right') {
    return t(width + 30, height / 2, rotations[side]);
  }
  if (side === 'top') {
    return t(width / 2, -20, rotations[side]);
  }
  if (side === 'bottom') {
    return t(width / 2, height + 30, rotations[side]);
  }
};

const getY = (side, height) => {
  switch (side) {
    case 'left':
      return -height;
    case 'top':
      return -height;
    case 'right':
      return -height - 10;
    default:
      return -height + 10;
  }
};

class RawLabel extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    side: PropTypes.string,
    classes: PropTypes.object,
    disabledLabel: PropTypes.bool,
    placeholder: PropTypes.string,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {
    onChange: () => {}
  };

  render() {
    const { disabledLabel, placeholder, text, side, graphProps, classes, onChange } = this.props;
    const { size, domain, range } = graphProps;
    const totalHeight = (size.height || 500) + (range.padding || 0) * 2;
    const totalWidth = (size.width || 500) + (domain.padding || 0) * 2;

    const transform = getTransform(side, totalWidth, totalHeight);
    const width = side === 'left' || side === 'right' ? totalHeight : totalWidth;
    const height = 36;
    const y = getY(side, height);
    const finalHeight = side === 'bottom' ? height + 22 : height + 18;

    const activePlugins = [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'math'
      // 'languageCharacters'
    ];

    return (
      <foreignObject
        x={-(width / 2)}
        y={y}
        width={width}
        height={finalHeight}
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
            placeholder={!disabledLabel && placeholder}
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
    textAlign: 'center',
    padding: '0 4px'
  },
  disabledAxisLabel: {
    pointerEvents: 'none'
  },
  bottomLabel: {
    marginTop: '44px'
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
    placeholders: PropTypes.object,
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
    const { disabledLabels, placeholders = {}, value = {}, graphProps } = this.props;

    return (
      <React.Fragment>
        <Label
          key="left"
          side="left"
          text={value.left}
          disabledLabel={disabledLabels}
          placeholder={placeholders.left}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'left')}
        />
        <Label
          key="top"
          side="top"
          text={value.top}
          disabledLabel={disabledLabels}
          placeholder={placeholders.top}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'top')}
        />
        <Label
          key="bottom"
          side="bottom"
          text={value.bottom}
          disabledLabel={disabledLabels}
          placeholder={placeholders.bottom}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'bottom')}
        />
        <Label
          key="right"
          side="right"
          text={value.right}
          disabledLabel={disabledLabels}
          placeholder={placeholders.right}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'right')}
        />
      </React.Fragment>
    );
  }
}

export default Labels;
