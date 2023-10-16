import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../icons/index';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import Feedback from './feedback';
import debug from 'debug';

const log = debug('pie-libs:render-ui:response-indicators');

const styles = () => ({
  responseIndicator: {
    cursor: 'pointer',
  },
  paper: {
    padding: '0',
    borderRadius: '4px',
  },
  popover: {
    cursor: 'pointer',
  },
  popperClose: {
    cursor: 'pointer',
  },
});

const BuildIndicator = (Icon, correctness) => {
  class RawIndicator extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    handlePopoverOpen = (event) => {
      log('[handlePopoverOpen]', event.target);
      this.setState({ anchorEl: event.target });
    };

    handlePopoverClose = () => {
      this.setState({ anchorEl: null });
    };

    render() {
      const { feedback, classes } = this.props;
      const { anchorEl } = this.state;
      return (
        <div className={feedback && classes.responseIndicator}>
          <span ref={(r) => (this.icon = r)} onClick={this.handlePopoverOpen}>
            <Icon />
          </span>

          {feedback && (
            <Popover
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={!!anchorEl}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={this.handlePopoverClose}
            >
              <Feedback feedback={feedback} correctness={correctness} />
            </Popover>
          )}
        </div>
      );
    }
  }

  RawIndicator.propTypes = {
    feedback: PropTypes.string,
    classes: PropTypes.object.isRequired,
  };

  return withStyles(styles)(RawIndicator);
};

export const Correct = BuildIndicator(icons.Correct, 'correct');
export const Incorrect = BuildIndicator(icons.Incorrect, 'incorrect');
export const PartiallyCorrect = BuildIndicator(icons.PartiallyCorrect, 'partially-correct');
export const NothingSubmitted = BuildIndicator(icons.NothingSubmitted, 'nothing-submitted');
