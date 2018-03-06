import { Circle, IconRoot, RoundFeedbackBox, Square, SquareFeedbackBox, getStyles } from './icon-root';

import PropTypes from 'prop-types';
import React from 'react';

export default (Action, Emoji) => {

  class IconBase extends React.Component {

    constructor(props) {
      super(props);
      const { classes, size } = this.props;

      this.icons = {
        feedback: {
          round: {
            check: <IconRoot size={size}>
              <RoundFeedbackBox className={classes.bg} />
              <Action className={classes.fg} />
            </IconRoot>,
            emoji: <IconRoot size={size}>
              <RoundFeedbackBox className={classes.bg} />
              <Emoji className={classes.fg} />
            </IconRoot>,
            open: {
              check: <IconRoot size={size}>
                <Action className={classes.bg} />
              </IconRoot>,
              emoji: <IconRoot size={size}>
                <Emoji className={classes.bg} />
              </IconRoot>
            }
          },
          square: {
            check: <IconRoot size={size}>
              <SquareFeedbackBox className={classes.bg} />
              <Action className={classes.fg} />
            </IconRoot>,
            emoji: <IconRoot size={size}>
              <SquareFeedbackBox className={classes.bg} />
              <Emoji className={classes.fg} />
            </IconRoot>,
            open: {
              check: <IconRoot size={size}>
                <Action className={classes.bg} />
              </IconRoot>,
              emoji: <IconRoot size={size}>
                <Emoji className={classes.bg} />
              </IconRoot>
            }
          }
        },
        round: {
          check: <IconRoot size={size}>
            <Circle className={classes.bg} />
            <Action className={classes.fg} />
          </IconRoot>,
          emoji: <IconRoot size={size}>
            <Circle className={classes.bg} />
            <Emoji className={classes.fg} />
          </IconRoot>,
          open: {
            check: <IconRoot size={size}>
              <Action className={classes.bg} />
            </IconRoot>,
            emoji: <IconRoot size={size}>
              <Emoji className={classes.bg} />
            </IconRoot>
          }
        },
        square: {
          check: <IconRoot size={size}>
            <Square className={classes.bg} />
            <Action className={classes.fg} />
          </IconRoot>,
          emoji: <IconRoot size={size}>
            <Square className={classes.bg} />
            <Emoji className={classes.fg} />
          </IconRoot>,
          open: {
            check:
              <IconRoot size={size}>
                <Action className={classes.bg} />
              </IconRoot>,
            emoji:
              <IconRoot size={size}>
                <Emoji className={classes.bg} />
              </IconRoot>
          }
        }
      }
    }

    render() {
      if (this.props.category === undefined) {
        if (this.props.open === true) {
          return this.icons[this.props.shape].open[this.props.iconSet];
        } else {
          return this.icons[this.props.shape][this.props.iconSet];
        }
      } else {
        if (this.props.open === true) {
          return this.icons.feedback[this.props.shape].open[this.props.iconSet];
        } else {
          return this.icons.feedback[this.props.shape][this.props.iconSet];
        }
      }
      return null;
    }

  }

  IconBase.propTypes = {
    iconSet: PropTypes.oneOf(['emoji', 'check']),
    shape: PropTypes.oneOf(['round', 'square']),
    category: PropTypes.oneOf(['feedback', undefined]),
    open: PropTypes.bool
  };

  IconBase.defaultProps = {
    iconSet: 'check',
    shape: 'round',
    category: undefined,
    open: false
  };

  return IconBase;
}

