import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { types } from '@pie-lib/plot';
import { color, Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import cn from 'classnames';

const rotations = {
  left: -90,
  top: 0,
  bottom: 0,
  right: 90,
};

export const getTransform = (side, width, height) => {
  const t = (x, y, rotate) => `translate(${x}, ${y}), rotate(${rotate})`;

  if (side === 'left') return t(-20, height / 2, rotations[side]);
  if (side === 'right') return t(width + 30, height / 2, rotations[side]);
  if (side === 'top') return t(width / 2, -20, rotations[side]);
  if (side === 'bottom') return t(width / 2, height + 30, rotations[side]);
};

const getY = (side, height) => {
  switch (side) {
    case 'left':
    case 'top':
      return -height;
    case 'right':
      return -height - 10;
    default:
      return -height + 10;
  }
};

const PREFIX = 'Label';
const classes = {
  label: `${PREFIX}-label`,
  axisLabel: `${PREFIX}-axisLabel`,
  disabledAxisLabel: `${PREFIX}-disabledAxisLabel`,
  bottomLabel: `${PREFIX}-bottomLabel`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.label}`]: {
    fill: color.defaults.SECONDARY,
  },
  [`& .${classes.axisLabel}`]: {
    fontSize: theme.typography.fontSize - 2,
    textAlign: 'center',
    padding: '0 4px',
  },
  [`& .${classes.disabledAxisLabel}`]: {
    pointerEvents: 'none',
  },
  [`& .${classes.bottomLabel}`]: {
    marginTop: '44px',
  },
}));

class RawLabel extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    side: PropTypes.string,
    disabledLabel: PropTypes.bool,
    placeholder: PropTypes.string,
    graphProps: types.GraphPropsType.isRequired,
    onChange: PropTypes.func,
    mathMlOptions: PropTypes.object,
  };

  static defaultProps = {
    onChange: () => {},
  };

  render() {
    const { disabledLabel, placeholder, text, side, graphProps, onChange, mathMlOptions = {} } = this.props;
    const { size, domain, range } = graphProps;
    const totalHeight = (size.height || 500) + (range.padding || 0) * 2;
    const totalWidth = (size.width || 500) + (domain.padding || 0) * 2;

    const transform = getTransform(side, totalWidth, totalHeight);
    const width = side === 'left' || side === 'right' ? totalHeight : totalWidth;
    const height = 36;
    const y = getY(side, height);
    const finalHeight = side === 'bottom' ? height + 22 : height + 18;

    const activePlugins = ['bold', 'italic', 'underline', 'strikethrough', 'math'];

    return (
      <Root>
        <foreignObject
          x={-(width / 2)}
          y={y}
          width={width}
          height={finalHeight}
          transform={transform}
          textAnchor="middle"
        >
          <Readable>
            <EditableHtml
              className={cn(
                {
                  [classes.bottomLabel]: side === 'bottom',
                  [classes.disabledAxisLabel]: disabledLabel,
                },
                classes.axisLabel,
              )}
              markup={text || ''}
              onChange={onChange}
              placeholder={!disabledLabel && placeholder}
              toolbarOpts={{
                position: side === 'bottom' ? 'top' : 'bottom',
                noPadding: true,
                noBorder: true,
              }}
              activePlugins={activePlugins}
              mathMlOptions={mathMlOptions}
            />
          </Readable>
        </foreignObject>
      </Root>
    );
  }
}

export const LabelType = {
  left: PropTypes.string,
  top: PropTypes.string,
  bottom: PropTypes.string,
  right: PropTypes.string,
};

export class Labels extends React.Component {
  static propTypes = {
    disabledLabels: PropTypes.bool,
    placeholders: PropTypes.object,
    value: PropTypes.shape(LabelType),
    graphProps: PropTypes.object,
    onChange: PropTypes.func,
    mathMlOptions: PropTypes.object,
  };

  onChangeLabel = (newValue, side) => {
    const { value, onChange } = this.props;
    const labels = { ...value, [side]: newValue };
    onChange(labels);
  };

  render() {
    const { disabledLabels, placeholders = {}, value = {}, graphProps, mathMlOptions = {} } = this.props;

    return (
      <>
        {['left', 'top', 'bottom', 'right'].map((side) => (
          <RawLabel
            key={side}
            side={side}
            text={value[side]}
            disabledLabel={disabledLabels}
            placeholder={placeholders[side]}
            graphProps={graphProps}
            onChange={(val) => this.onChangeLabel(val, side)}
            mathMlOptions={mathMlOptions}
          />
        ))}
      </>
    );
  }
}

export default RawLabel;
