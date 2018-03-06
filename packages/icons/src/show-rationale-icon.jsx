import PropTypes from 'prop-types';
import React from 'react';
import injectSheet from 'react-jss';
import { normalizeSize } from './icon-root';

const Info = ({ fg, border }) => (
  <g>
    <rect x="-115" y="136.7" className={fg} width="3" height="3" />
    <polygon className={fg}
      points="-112,147.7 -112,141.7 -115.8,141.7 -115.8,143.7 -114,143.7 -114,147.7 -116.2,147.7 -116.2,149.7 -109.8,149.7 -109.8,147.7" />
  </g>
);

const Border = ({ className }) => (
  <path className={className}
    d="M-113,158.5c-8,0-14.5-6.5-14.5-14.5s6.5-14.5,14.5-14.5s14.5,6.5,14.5,14.5S-105,158.5-113,158.5zM-113,130.5c-7.4,0-13.5,6.1-13.5,13.5s6.1,13.5,13.5,13.5s13.5-6.1,13.5-13.5S-105.6,130.5-113,130.5z" />
)
const Circle = () => (
  <g>
    <path style={{ fill: '#D0CAC5', stroke: '#E6E3E0', strokeWidth: 0.75, 'strokeMiterlimit': 10 }} d="M-111.7,160.9c-8.5,0-15.5-6.9-15.5-15.5c0-8.5,6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5C-96.2,154-103.1,160.9-111.7,160.9z" />
    <path style={{ fill: '#B3ABA4', stroke: '#CDC7C2', strokeWidth: 0.5, 'strokeMiterlimit': 10 }} d="M-112,159.5c-8,0-14.5-6.5-14.5-14.5s6.5-14.5,14.5-14.5s14.5,6.5,14.5,14.5S-104,159.5-112,159.5z" />
    <circle style={{ fill: '#FFFFFF' }} cx="-113" cy="144" r="14" />
  </g>
);

const Root = ({ children, size }) => {
  size = normalizeSize(size);
  const style = {
    height: size,
    width: size,
    display: 'inline-block',
    position: 'relative'
  }

  return (
    <div style={style}>
      <svg
        preserveAspectRatio="xMinYMin meet"
        viewBox="-129 128 34 34">
        {children}
      </svg>
    </div>
  );
}

const styles = {
  fg: {
    fill: '#1a9cff'
  },
  bg: {
    fill: '#bce2ff'
  },
  border: {
    fill: '#bbe3fd'
  },
  whiteBorder: {
    fill: 'white'
  }
}

export class ShowRationale extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    const info = <Info fg={classes.fg} />;
    const icons = {
      check: <Root><Circle />{info}<Border className={classes.border} /></Root>,
      emoji: <Root><Circle />{info}<Border className={classes.border} /></Root>,
      open: {
        check:
          <Root>
            <circle style={{ fill: '#FFFFFF' }} cx="-113" cy="144" r="14" />
            <Info fg={classes.bg} border={classes.whiteBorder} />
          </Root>,
        emoji:
          <Root>
            <circle style={{ fill: '#FFFFFF' }} cx="-113" cy="144" r="14" />
            <Info fg={classes.bg} border={classes.border} />
          </Root>
      }
    };

    if (this.props.open === true) {
      return icons.open[this.props.iconSet];
    } else {
      return icons[this.props.iconSet];
    }
  }

}

ShowRationale.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check']),
  open: PropTypes.bool
};

ShowRationale.defaultProps = {
  iconSet: 'check',
  open: false
};

export default injectSheet(styles)(ShowRationale);
