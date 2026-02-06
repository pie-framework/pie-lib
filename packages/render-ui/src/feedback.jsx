import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
  WebkitFontSmoothing: 'antialiased',
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

const TransitionWrapper = styled('div')({
  '&.feedback-enter': {
    height: '1px',
  },
  '&.feedback-enter-active': {
    height: '45px',
    transition: 'height 500ms',
  },
  '&.feedback-exit': {
    height: '45px',
  },
  '&.feedback-exit-active': {
    height: '1px',
    transition: 'height 200ms',
  },
});

export class Feedback extends React.Component {
  static propTypes = {
    correctness: PropTypes.string,
    feedback: PropTypes.string,
  };

  nodeRef = React.createRef();

  renderFeedback() {
    const { correctness, feedback } = this.props;

    if (!correctness || !feedback) return null;

    return (
      <CSSTransition key="hasFeedback" nodeRef={this.nodeRef} timeout={{ enter: 500, exit: 200 }} classNames="feedback">
        <TransitionWrapper ref={this.nodeRef}>
          <FeedbackContainer>
            <FeedbackContent className={correctness} dangerouslySetInnerHTML={{ __html: feedback }} />
          </FeedbackContainer>
        </TransitionWrapper>
      </CSSTransition>
    );
  }

  render() {
    return (
      <div>
        <TransitionGroup>{this.renderFeedback()}</TransitionGroup>
      </div>
    );
  }
}

export default Feedback;
