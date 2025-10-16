import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '@pie-lib/icons';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import Feedback from './feedback';
import debug from 'debug';

const log = debug('pie-libs:render-ui:response-indicators');

const ResponseIndicatorContainer = styled('div')(({ hasFeedback }) => ({
  cursor: hasFeedback ? 'pointer' : 'default',
}));

const StyledPopover = styled(Popover)({
  cursor: 'pointer',
});

const PopoverPaper = styled('div')({
  padding: '0',
  borderRadius: '4px',
});

const BuildIndicator = (Icon, correctness) => {
  class Indicator extends React.Component {
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
      const { feedback } = this.props;
      const { anchorEl } = this.state;
      return (
        <ResponseIndicatorContainer hasFeedback={!!feedback}>
          <span ref={(r) => (this.icon = r)} onClick={this.handlePopoverOpen}>
            <Icon />
          </span>

          {feedback && (
            <StyledPopover
              PaperComponent={PopoverPaper}
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
            </StyledPopover>
          )}
        </ResponseIndicatorContainer>
      );
    }
  }

  Indicator.propTypes = {
    feedback: PropTypes.string,
  };

  return Indicator;
};

export const Correct = BuildIndicator(icons.Correct, 'correct');
export const Incorrect = BuildIndicator(icons.Incorrect, 'incorrect');
export const PartiallyCorrect = BuildIndicator(icons.PartiallyCorrect, 'partially-correct');
export const NothingSubmitted = BuildIndicator(icons.NothingSubmitted, 'nothing-submitted');
