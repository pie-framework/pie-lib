/**
 * Lifted from multiple-choice - TODO: create a shared package for it.
 */
import { withStyles, withTheme } from 'material-ui/styles';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames';

const styleSheet = {
  corespringFeedback: {
    transformOrigin: '0% 0px 0px',
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    '&:.incorrect': {
      color: '#946202'
    }
  },
  content: {
    '-webkit-font-smoothing': 'antialiased',
    backgroundColor: 'var(--feedback-bg-color, grey)',
    borderRadius: '4px',
    fontFamily: "'Roboto', 'Noto', sans-serif",
    fontSize: '12px',
    lineHeight: '25px',
    margin: '0px',
    padding: '10px',
    verticalAlign: 'middle',
    color: 'var(--feedback-color, white)'
  },
  correct: {
    backgroundColor: 'var(--feedback-correct-bg-color, green)'
  },
  incorrect: {
    backgroundColor: 'var(--feedback-incorrect-bg-color, orange)'
  },
  feedbackEnter: {
    height: '1px'
  },
  feedbackEnterActive: {
    height: '45px',
    transition: 'height 500ms'
  },
  feedbackLeave: {
    height: '45px'
  },
  feedbackLeaveActive: {
    height: '1px',
    transition: 'height 200ms'
  }
};

export class Feedback extends React.Component {

  render() {
    const { correctness, feedback, classes } = this.props;

    function chooseFeedback(correctness) {
      if (correctness && feedback) {
        return <div
          key="hasFeedback"
          className={classes.corespringFeedback}>
          <div className={classNames(classes.content, classes[correctness])}
            dangerouslySetInnerHTML={{ __html: feedback }}></div>
        </div>
      } else {
        return null;
      }
    }

    return <ReactCSSTransitionGroup
      transitionName={{
        enter: classes.feedbackEnter,
        enterActive: classes.feedbackEnterActive,
        leave: classes.feedbackLeave,
        leaveActive: classes.feedbackLeaveActive,
      }}
      transitionEnterTimeout={500}
      transitionLeaveTimeout={200}>
      {chooseFeedback(correctness)}
    </ReactCSSTransitionGroup>;
  }
}

Feedback.propTypes = {
  correctness: React.PropTypes.string,
  feedback: React.PropTypes.string
}

export default withStyles(styleSheet, { name: 'Feedback' })(Feedback);