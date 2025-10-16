/**
 * Lifted from multiple-choice - TODO: create a shared package for it.
 */
import { styled } from '@mui/material/styles';

import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as color from './color';

const FeedbackContainer = styled('div')({
  transformOrigin: '0% 0px 0px',
  width: '100%',
  display: 'block',
  overflow: 'hidden',
  '&.incorrect': {
    color: '#946202',
  },
});

const FeedbackContent = styled('div')({
  '-webkit-font-smoothing': 'antialiased',
  backgroundColor: `var(--feedback-bg-color, ${color.disabled()})`,
  borderRadius: '4px',
  lineHeight: '25px',
  margin: '0px',
  padding: '10px',
  verticalAlign: 'middle',
  color: 'var(--feedback-color, white)',
  '&.correct': {
    backgroundColor: `var(--feedback-correct-bg-color, ${color.correct()})`,
  },
  '&.incorrect': {
    backgroundColor: `var(--feedback-incorrect-bg-color, ${color.incorrect()})`,
  },
});

const transitionClasses = {
  feedbackEnter: 'feedback-enter',
  feedbackEnterActive: 'feedback-enter-active',
  feedbackLeave: 'feedback-leave',
  feedbackLeaveActive: 'feedback-leave-active',
};

const TransitionWrapper = styled('div')({
  [`&.${transitionClasses.feedbackEnter}`]: {
    height: '1px',
  },
  [`&.${transitionClasses.feedbackEnterActive}`]: {
    height: '45px',
    transition: 'height 500ms',
  },
  [`&.${transitionClasses.feedbackLeave}`]: {
    height: '45px',
  },
  [`&.${transitionClasses.feedbackLeaveActive}`]: {
    height: '1px',
    transition: 'height 200ms',
  },
});

export class Feedback extends React.Component {
  static propTypes = {
    correctness: PropTypes.string,
    feedback: PropTypes.string,
  };

  render() {
    const { correctness, feedback } = this.props;

    function chooseFeedback(correctness) {
      if (correctness && feedback) {
        return (
          <CSSTransition classNames={transitionClasses} key="hasFeedback" timeout={{ enter: 500, exit: 300 }}>
            <TransitionWrapper>
              <FeedbackContainer>
                <FeedbackContent className={classNames(correctness)} dangerouslySetInnerHTML={{ __html: feedback }} />
              </FeedbackContainer>
            </TransitionWrapper>
          </CSSTransition>
        );
      } else {
        return null;
      }
    }

    return (
      <div>
        <TransitionGroup>{chooseFeedback(correctness)}</TransitionGroup>
      </div>
    );
  }
}

export default Feedback;
