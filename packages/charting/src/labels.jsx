import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';
import { color, Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import cn from 'classnames';

const rotations = {
  left: -90,
  bottom: 0
};

export const getTransform = (side, width, height) => {
  const t = (x, y, rotate) => `translate(${x}, ${y}), rotate(${rotate})`;

  if (side === 'left') {
    return t(-20, height / 2, rotations[side]);
  }

  return t(width / 2, height + 30, rotations[side]);
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
    const {
      disabledLabel,
      text,
      side,
      graphProps,
      classes,
      onChange,
      titlePlaceholder
    } = this.props;
    const { size, domain, range } = graphProps;
    const totalHeight = (size.height || 500) + (range.padding || 0) * 2;
    const totalWidth = (size.width || 500) + (domain.padding || 0) * 2;
    const transform = getTransform(side, totalWidth, totalHeight);
    const width = side === 'left' ? totalHeight : totalWidth;
    const height = 32;
    const y = side === 'left' ? -height : -35;

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
        height={height * 3}
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
              classes.axisLabel,
              classes.label
            )}
            markup={text || ''}
            onChange={onChange}
            placeholder={!disabledLabel && titlePlaceholder}
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
    color: color.secondary()
  },
  axisLabel: {
    fontSize: theme.typography.fontSize,
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
  bottom: PropTypes.string
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
    const { onChangeLeftLabel, onChangeRightLabel, graphProps } = this.props;

    if (side === 'left') {
      const range = { ...graphProps.range, label: newValue };

      onChangeLeftLabel(range);
    } else {
      const domain = { ...graphProps.domain, label: newValue };

      onChangeRightLabel(domain);
    }
  };

  render() {
    const { disabledLabels, value = {}, graphProps, titlePlaceholder } = this.props;

    return (
      <React.Fragment>
        <Label
          key="left"
          side="left"
          text={value.left}
          disabledLabel={disabledLabels}
          titlePlaceholder={titlePlaceholder}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'left')}
        />
        <Label
          key="bottom"
          side="bottom"
          text={value.bottom}
          disabledLabel={disabledLabels}
          titlePlaceholder={titlePlaceholder}
          graphProps={graphProps}
          onChange={value => this.onChangeLabel(value, 'bottom')}
        />
      </React.Fragment>
    );
  }
}

export default Labels;
