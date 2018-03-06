import { IconRoot, getStyles } from './icon-root';

import PropTypes from 'prop-types';
import React from 'react';
import injectSheet from 'react-jss';

const Exclamation = ({ className }) => (
  <g>
    <rect x="19.3" y="10.3" className={className} width="4.5" height="12.7" />
    <rect x="19.3" y="26.2" className={className} width="4.5" height="4.5" />
  </g>
);

const Octagon = ({ className }) => (
  <polygon
    className={className}
    points="14.8,4.5 5.6,13.8 5.6,27 14.8,36.5 28.1,36.5 37.6,27 37.6,13.8 28.1,4.5" />

)

const Emoji = ({ className }) => (
  <g>
    <rect x="23.8" y="15"
      className={className} width="3.5" height="4.4" />
    <rect x="16" y="15"
      className={className} width="3.5" height="4.4" />
    <path
      className={className}
      d="M24.2,27.1h-5.1c-0.8,0-1.5-0.7-1.5-1.5v0c0-0.8,0.7-1.5,1.5-1.5h5.1c0.8,0,1.5,0.7,1.5,1.5v0
      C25.7,26.4,25,27.1,24.2,27.1z"/>
  </g>
)

const styles = getStyles('nothing-submitted', 'white', '#464146');
export class NothingSubmitted extends React.Component {

  constructor(props) {
    super(props);
    const { classes } = this.props;
    this.icons = {
      check:

      <IconRoot>
        <Octagon className={classes.bg} />
        <Exclamation className={classes.fg} />
      </IconRoot>,
      emoji:
      <IconRoot>
        <Octagon className={classes.bg} />
        <Emoji className={classes.fg} />
      </IconRoot>,
      feedback: {
        check:
        <IconRoot>
          <Octagon className={classes.bg} />
          <Emoji className={classes.fg} />
        </IconRoot>,
        emoji:
        <IconRoot>
          <Octagon className={classes.bg} />
          <Emoji className={classes.fg} />
        </IconRoot>,
        square: {
          check:
          <IconRoot>
            <Octagon className={classes.bg} />
            <Exclamation className={classes.fg} />
          </IconRoot>,
          emoji:
          <IconRoot>
            <Octagon className={classes.bg} />
            <Emoji className={classes.fg} />
          </IconRoot>,
          open: {
            check:
            <IconRoot>
              <Exclamation className={classes.bg} />
            </IconRoot>,
            emoji:
            <IconRoot>
              <Emoji className={classes.bg} />
            </IconRoot>
          }
        }
      }
    };
  }

  render() {
    if (this.props.category === undefined) {
      console.log(`icons[${this.props.iconSet}]`);
      return this.icons[this.props.iconSet];
    } else {
      if (this.props.shape === undefined) {
        console.log(`icons.feedback[${this.props.iconSet}]`);
        return this.icons.feedback[this.props.iconSet];
      } else {
        if (this.props.open === true) {
          console.log(`icons.feedback.square.open[${this.props.iconSet}]`);
          return this.icons.feedback.square.open[this.props.iconSet];
        } else {
          console.log(`icons.feedback.square[${this.props.iconSet}]`);
          return this.icons.feedback.square[this.props.iconSet];
        }
      }
    }

    return null;
  }

}

NothingSubmitted.propTypes = {
  iconSet: PropTypes.oneOf(['emoji', 'check', undefined]),
  shape: PropTypes.oneOf(['square', undefined]),
  category: PropTypes.oneOf(['feedback', undefined]),
  open: PropTypes.bool
};

NothingSubmitted.defaultProps = {
  iconSet: 'check',
  shape: undefined,
  category: undefined,
  open: false
};

export default injectSheet(styles)(NothingSubmitted);