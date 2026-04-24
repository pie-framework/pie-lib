import PropTypes from 'prop-types';
import React from 'react';
import { IconRoot } from './icon-root';

// Exclamation mark
const Exclamation = ({ fill }) => (
  <g>
    <rect x="19.3" y="10.3" width="4.5" height="12.7" fill={fill} />
    <rect x="19.3" y="26.2" width="4.5" height="4.5" fill={fill} />
  </g>
);

Exclamation.propTypes = { fill: PropTypes.string.isRequired };

// Octagon background
const Octagon = ({ fill }) => (
  <polygon points="14.8,4.5 5.6,13.8 5.6,27 14.8,36.5 28.1,36.5 37.6,27 37.6,13.8 28.1,4.5" fill={fill} />
);

Octagon.propTypes = { fill: PropTypes.string.isRequired };

// Emoji variant
const Emoji = ({ fill }) => (
  <g>
    <rect x="23.8" y="15" width="3.5" height="4.4" fill={fill} />
    <rect x="16" y="15" width="3.5" height="4.4" fill={fill} />
    <path
      d="M24.2,27.1h-5.1c-0.8,0-1.5-0.7-1.5-1.5v0c0-0.8,0.7-1.5,1.5-1.5h5.1c0.8,0,1.5,0.7,1.5,1.5v0
         C25.7,26.4,25,27.1,24.2,27.1z"
      fill={fill}
    />
  </g>
);

Emoji.propTypes = { fill: PropTypes.string.isRequired };

// Exported NothingSubmitted icon
export class NothingSubmitted extends React.Component {
  constructor(props) {
    super(props);
    const { fg = '#464146', bg = 'white' } = this.props;

    this.icons = {
      check: (
        <IconRoot>
          <Octagon fill={bg} />
          <Exclamation fill={fg} />
        </IconRoot>
      ),
      emoji: (
        <IconRoot>
          <Octagon fill={bg} />
          <Emoji fill={fg} />
        </IconRoot>
      ),
      feedback: {
        check: (
          <IconRoot>
            <Octagon fill={bg} />
            <Emoji fill={fg} />
          </IconRoot>
        ),
        emoji: (
          <IconRoot>
            <Octagon fill={bg} />
            <Emoji fill={fg} />
          </IconRoot>
        ),
        square: {
          check: (
            <IconRoot>
              <Octagon fill={bg} />
              <Exclamation fill={fg} />
            </IconRoot>
          ),
          emoji: (
            <IconRoot>
              <Octagon fill={bg} />
              <Emoji fill={fg} />
            </IconRoot>
          ),
          open: {
            check: (
              <IconRoot>
                <Exclamation fill={bg} />
              </IconRoot>
            ),
            emoji: (
              <IconRoot>
                <Emoji fill={bg} />
              </IconRoot>
            ),
          },
        },
      },
    };
  }

  render() {
    const { iconSet, category, shape, open } = this.props;

    if (category === undefined) {
      return this.icons[iconSet];
    } else {
      if (shape === undefined) {
        return this.icons.feedback[iconSet];
      } else {
        if (open === true) {
          return this.icons.feedback.square.open[iconSet];
        } else {
          return this.icons.feedback.square[iconSet];
        }
      }
    }
  }
}

NothingSubmitted.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check', undefined]),
  shape: PropTypes.oneOf(['square', undefined]),
  category: PropTypes.oneOf(['feedback', undefined]),
  open: PropTypes.bool,
  fg: PropTypes.string,
  bg: PropTypes.string,
};

NothingSubmitted.defaultProps = {
  iconSet: 'check',
  shape: undefined,
  category: undefined,
  open: false,
  fg: '#464146', // foreground color
  bg: 'white', // background color
};

export default NothingSubmitted;
