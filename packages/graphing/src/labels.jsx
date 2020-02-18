import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';

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

class RawLabel extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    side: PropTypes.string,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { text, side, graphProps } = this.props;

    const { size } = graphProps;

    const transform = getTransform(side, size.width, size.height);
    const width = side === 'left' || side === 'right' ? size.height : size.width;
    const height = 20;

    return (
      <foreignObject
        x={-(width / 2)}
        y={-height}
        width={width}
        height={20}
        transform={transform}
        textAnchor="middle"
      >
        <div style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: text }} />
      </foreignObject>
    );
  }
}

const Label = withStyles(theme => ({
  label: {
    fill: theme.palette.secondary.main
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
    value: PropTypes.shape(LabelType),
    graphProps: PropTypes.object
  };

  static defaultProps = {};

  render() {
    const { value, graphProps } = this.props;
    return (
      <React.Fragment>
        {value && value.left && (
          <Label key="left" side="left" text={value.left} graphProps={graphProps} />
        )}
        {value && value.top && (
          <Label key="top" side="top" text={value.top} graphProps={graphProps} />
        )}
        {value && value.bottom && (
          <Label key="bottom" side="bottom" text={value.bottom} graphProps={graphProps} />
        )}
        {value && value.right && (
          <Label key="right" side="right" text={value.right} graphProps={graphProps} />
        )}
      </React.Fragment>
    );
  }
}

export default Labels;
