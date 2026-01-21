import PropTypes from 'prop-types';
import React from 'react';
import { normalizeSize } from './sized';

// Info icon
const Info = ({ fill }) => (
  <g>
    <rect x="-115" y="136.7" width="3" height="3" fill={fill} />
    <polygon
      points="-112,147.7 -112,141.7 -115.8,141.7 -115.8,143.7 -114,143.7 -114,147.7 -116.2,147.7 -116.2,149.7 -109.8,149.7 -109.8,147.7"
      fill={fill}
    />
  </g>
);

Info.propTypes = { fill: PropTypes.string.isRequired };

// Border path
const Border = ({ fill }) => (
  <path
    d="M-113,158.5c-8,0-14.5-6.5-14.5-14.5s6.5-14.5,14.5-14.5s14.5,6.5,14.5,14.5S-105,158.5-113,158.5z
       M-113,130.5c-7.4,0-13.5,6.1-13.5,13.5s6.1,13.5,13.5,13.5s13.5-6.1,13.5-13.5S-105.6,130.5-113,130.5z"
    fill={fill}
  />
);

Border.propTypes = { fill: PropTypes.string.isRequired };

// Circle background
const Circle = ({ fill = '#FFFFFF' }) => (
  <g>
    <path
      style={{
        fill: '#D0CAC5',
        stroke: '#E6E3E0',
        strokeWidth: 0.75,
        strokeMiterlimit: 10,
      }}
      d="M-111.7,160.9c-8.5,0-15.5-6.9-15.5-15.5c0-8.5,6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5C-96.2,154-103.1,160.9-111.7,160.9z"
    />
    <path
      style={{
        fill: '#B3ABA4',
        stroke: '#CDC7C2',
        strokeWidth: 0.5,
        strokeMiterlimit: 10,
      }}
      d="M-112,159.5c-8,0-14.5-6.5-14.5-14.5s6.5-14.5,14.5-14.5s14.5,6.5,14.5,14.5S-104,159.5-112,159.5z"
    />
    <circle cx="-113" cy="144" r="14" fill={fill} />
  </g>
);

Circle.propTypes = { fill: PropTypes.string };

// Root wrapper for sizing
const Root = ({ children, size }) => {
  const normalizedSize = normalizeSize(size);
  const style = {
    height: normalizedSize,
    width: normalizedSize,
    display: 'inline-block',
    position: 'relative',
  };
  return (
    <div style={style}>
      <svg preserveAspectRatio="xMinYMin meet" viewBox="-129 128 34 34">
        {children}
      </svg>
    </div>
  );
};

Root.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Main ShowRationale component
export class ShowRationale extends React.Component {
  render() {
    const { iconSet, open, fg = '#1a9cff', bg = '#bce2ff', border = '#bbe3fd' } = this.props;

    const info = <Info fill={fg} />;

    const icons = {
      check: (
        <Root size={this.props.size}>
          <Circle />
          {info}
          <Border fill={border} />
        </Root>
      ),
      emoji: (
        <Root size={this.props.size}>
          <Circle />
          {info}
          <Border fill={border} />
        </Root>
      ),
      open: {
        check: (
          <Root size={this.props.size}>
            <circle cx="-113" cy="144" r="14" fill="#FFFFFF" />
            <Info fill={bg} />
            <Border fill="#FFFFFF" />
          </Root>
        ),
        emoji: (
          <Root size={this.props.size}>
            <circle cx="-113" cy="144" r="14" fill="#FFFFFF" />
            <Info fill={bg} />
            <Border fill={border} />
          </Root>
        ),
      },
    };

    if (open === true) {
      return icons.open[iconSet];
    } else {
      return icons[iconSet];
    }
  }
}

ShowRationale.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check']),
  open: PropTypes.bool,
  fg: PropTypes.string,
  bg: PropTypes.string,
  border: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ShowRationale.defaultProps = {
  iconSet: 'check',
  open: false,
  fg: '#1a9cff',
  bg: '#bce2ff',
  border: '#bbe3fd',
  size: 30,
};

export default ShowRationale;
