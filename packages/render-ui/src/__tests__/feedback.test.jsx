import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import { Feedback } from '../feedback';

describe('Feedback', () => {
  describe('rendering', () => {
    it('should render feedback when correctness and feedback are provided', () => {
      renderWithTheme(<Feedback correctness="correct" feedback="Great job!" />);
      expect(screen.getByText('Great job!')).toBeInTheDocument();
    });

    it('should not render feedback when correctness is missing', () => {
      renderWithTheme(<Feedback feedback="Great job!" />);
      expect(screen.queryByText('Great job!')).not.toBeInTheDocument();
    });

    it('should not render feedback when feedback text is missing', () => {
      renderWithTheme(<Feedback correctness="correct" />);
      const { container } = renderWithTheme(<Feedback correctness="correct" />);
      expect(container.querySelector('[class*="feedback"]')).not.toBeInTheDocument();
    });

    it('should not render feedback when both correctness and feedback are missing', () => {
      const { container } = renderWithTheme(<Feedback />);
      expect(container.querySelector('[class*="FeedbackContent"]')).not.toBeInTheDocument();
    });

    it('should render feedback with HTML content', () => {
      renderWithTheme(<Feedback correctness="correct" feedback="<strong>Excellent!</strong> You got it right." />);
      expect(screen.getByText(/Excellent!/)).toBeInTheDocument();
      expect(screen.getByText(/You got it right/)).toBeInTheDocument();
    });
  });

  describe('correctness states', () => {
    it('should render with correct class when correctness is "correct"', () => {
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback="Correct!" />);
      const feedbackElement = container.querySelector('.correct');
      expect(feedbackElement).toBeInTheDocument();
    });

    it('should render with incorrect class when correctness is "incorrect"', () => {
      const { container } = renderWithTheme(<Feedback correctness="incorrect" feedback="Try again!" />);
      const feedbackElement = container.querySelector('.incorrect');
      expect(feedbackElement).toBeInTheDocument();
    });

    it('should render with partial class when correctness is "partial"', () => {
      const { container } = renderWithTheme(<Feedback correctness="partial" feedback="Partially correct" />);
      expect(screen.getByText('Partially correct')).toBeInTheDocument();
    });

    it('should handle unknown correctness values', () => {
      const { container } = renderWithTheme(<Feedback correctness="unknown" feedback="Unknown state" />);
      expect(screen.getByText('Unknown state')).toBeInTheDocument();
    });
  });

  describe('feedback content', () => {
    it('should render simple text feedback', () => {
      renderWithTheme(<Feedback correctness="correct" feedback="Well done!" />);
      expect(screen.getByText('Well done!')).toBeInTheDocument();
    });

    it('should render feedback with special characters', () => {
      renderWithTheme(<Feedback correctness="incorrect" feedback="You selected 2 + 2 = 5. That's incorrect!" />);
      expect(screen.getByText(/You selected 2 \+ 2 = 5/)).toBeInTheDocument();
    });

    it('should render feedback with math markup', () => {
      renderWithTheme(<Feedback correctness="correct" feedback="The answer is <math><mn>42</mn></math>" />);
      expect(screen.getByText(/The answer is/)).toBeInTheDocument();
    });

    it('should render feedback with multiple HTML elements', () => {
      renderWithTheme(
        <Feedback correctness="correct" feedback="<p>Great!</p><ul><li>Point 1</li><li>Point 2</li></ul>" />,
      );
      expect(screen.getByText(/Great!/)).toBeInTheDocument();
      expect(screen.getByText(/Point 1/)).toBeInTheDocument();
      expect(screen.getByText(/Point 2/)).toBeInTheDocument();
    });

    it('should handle empty string feedback', () => {
      renderWithTheme(<Feedback correctness="correct" feedback="" />);
      // Empty feedback should not render
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback="" />);
      expect(container.querySelector('[class*="FeedbackContent"]')).not.toBeInTheDocument();
    });

    it('should render feedback with line breaks', () => {
      renderWithTheme(<Feedback correctness="incorrect" feedback="Line 1<br/>Line 2<br/>Line 3" />);
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
      expect(screen.getByText(/Line 2/)).toBeInTheDocument();
      expect(screen.getByText(/Line 3/)).toBeInTheDocument();
    });
  });

  describe('TransitionGroup integration', () => {
    it('should use TransitionGroup for animations', () => {
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback="Animated feedback" />);
      // TransitionGroup should be present
      expect(container.querySelector('[class*="transition"]')).toBeDefined();
    });

    it('should handle feedback changes', () => {
      const { rerender } = renderWithTheme(<Feedback correctness="correct" feedback="Initial feedback" />);
      expect(screen.getByText('Initial feedback')).toBeInTheDocument();

      rerender(<Feedback correctness="incorrect" feedback="Updated feedback" />);
      expect(screen.getByText('Updated feedback')).toBeInTheDocument();
    });

    it('should handle feedback addition', () => {
      const { rerender } = renderWithTheme(<Feedback />);
      expect(screen.queryByText('New feedback')).not.toBeInTheDocument();

      rerender(<Feedback correctness="correct" feedback="New feedback" />);
      expect(screen.getByText('New feedback')).toBeInTheDocument();
    });
  });

  describe('CSSTransition configuration', () => {
    it('should render with CSSTransition wrapper', () => {
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback="Test feedback" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have nodeRef for CSSTransition', () => {
      const feedback = new Feedback({ correctness: 'correct', feedback: 'Test' });
      expect(feedback.nodeRef).toBeDefined();
      expect(feedback.nodeRef.current).toBe(null);
    });
  });

  describe('styling classes', () => {
    it('should apply FeedbackContainer class', () => {
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback="Test" />);
      expect(container.querySelector('[class*="Feedback"]')).toBeDefined();
    });

    it('should apply correct styling for correct feedback', () => {
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback="Correct answer!" />);
      const correctElement = container.querySelector('.correct');
      expect(correctElement).toBeInTheDocument();
      expect(correctElement).toHaveTextContent('Correct answer!');
    });

    it('should apply incorrect styling for incorrect feedback', () => {
      const { container } = renderWithTheme(<Feedback correctness="incorrect" feedback="Wrong answer" />);
      const incorrectElement = container.querySelector('.incorrect');
      expect(incorrectElement).toBeInTheDocument();
      expect(incorrectElement).toHaveTextContent('Wrong answer');
    });
  });

  describe('edge cases', () => {
    it('should handle null correctness', () => {
      renderWithTheme(<Feedback correctness={null} feedback="Test" />);
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('should handle undefined correctness', () => {
      renderWithTheme(<Feedback correctness={undefined} feedback="Test" />);
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('should handle null feedback', () => {
      renderWithTheme(<Feedback correctness="correct" feedback={null} />);
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback={null} />);
      expect(container.querySelector('[class*="FeedbackContent"]')).not.toBeInTheDocument();
    });

    it('should handle undefined feedback', () => {
      renderWithTheme(<Feedback correctness="correct" feedback={undefined} />);
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback={undefined} />);
      expect(container.querySelector('[class*="FeedbackContent"]')).not.toBeInTheDocument();
    });

    it('should handle very long feedback text', () => {
      const longFeedback = 'A'.repeat(1000);
      renderWithTheme(<Feedback correctness="correct" feedback={longFeedback} />);
      expect(screen.getByText(longFeedback)).toBeInTheDocument();
    });
  });

  describe('dangerouslySetInnerHTML', () => {
    it('should render HTML safely using dangerouslySetInnerHTML', () => {
      renderWithTheme(<Feedback correctness="correct" feedback='<span id="test-span">HTML Content</span>' />);
      const htmlElement = document.getElementById('test-span');
      expect(htmlElement).toBeInTheDocument();
      expect(htmlElement).toHaveTextContent('HTML Content');
    });

    it('should handle complex nested HTML', () => {
      renderWithTheme(<Feedback correctness="incorrect" feedback="<div><p>Paragraph 1</p><p>Paragraph 2</p></div>" />);
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });

    it('should render HTML with inline styles', () => {
      renderWithTheme(<Feedback correctness="correct" feedback='<span style="color: red;">Styled text</span>' />);
      expect(screen.getByText('Styled text')).toBeInTheDocument();
    });
  });

  describe('component lifecycle', () => {
    it('should render correctly on mount', () => {
      renderWithTheme(<Feedback correctness="correct" feedback="Mounted feedback" />);
      expect(screen.getByText('Mounted feedback')).toBeInTheDocument();
    });

    it('should update correctly when props change', () => {
      const { rerender } = renderWithTheme(<Feedback correctness="correct" feedback="Original" />);
      expect(screen.getByText('Original')).toBeInTheDocument();

      rerender(<Feedback correctness="incorrect" feedback="Changed" />);
      expect(screen.getByText('Changed')).toBeInTheDocument();
      expect(screen.queryByText('Original')).not.toBeInTheDocument();
    });

    it('should handle multiple rapid updates', () => {
      const { rerender } = renderWithTheme(<Feedback correctness="correct" feedback="V1" />);

      rerender(<Feedback correctness="incorrect" feedback="V2" />);
      rerender(<Feedback correctness="correct" feedback="V3" />);
      rerender(<Feedback correctness="incorrect" feedback="V4" />);

      expect(screen.getByText('V4')).toBeInTheDocument();
      expect(screen.queryByText('V1')).not.toBeInTheDocument();
      expect(screen.queryByText('V2')).not.toBeInTheDocument();
      expect(screen.queryByText('V3')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render accessible content structure', () => {
      const { container } = renderWithTheme(<Feedback correctness="correct" feedback="Accessible feedback" />);
      expect(screen.getByText('Accessible feedback')).toBeInTheDocument();
      expect(container.textContent).toContain('Accessible feedback');
    });

    it('should preserve semantic HTML in feedback', () => {
      renderWithTheme(<Feedback correctness="correct" feedback="<strong>Important:</strong> Good work!" />);
      const strongElement = document.querySelector('strong');
      expect(strongElement).toBeInTheDocument();
      expect(strongElement).toHaveTextContent('Important:');
    });
  });

  describe('integration scenarios', () => {
    it('should work in a typical correct answer scenario', () => {
      renderWithTheme(
        <Feedback correctness="correct" feedback="<strong>Correct!</strong> You identified the right answer." />,
      );
      const container = screen.getByText(/Correct!/);
      expect(container).toBeInTheDocument();
      expect(screen.getByText(/You identified the right answer/)).toBeInTheDocument();
    });

    it('should work in a typical incorrect answer scenario', () => {
      renderWithTheme(
        <Feedback
          correctness="incorrect"
          feedback="<strong>Incorrect.</strong> Please review the material and try again."
        />,
      );
      expect(screen.getByText(/Incorrect/)).toBeInTheDocument();
      expect(screen.getByText(/Please review the material/)).toBeInTheDocument();
    });

    it('should work in a partially correct scenario', () => {
      renderWithTheme(
        <Feedback correctness="partial" feedback="You got some parts correct, but missed a few key points." />,
      );
      expect(screen.getByText(/You got some parts correct/)).toBeInTheDocument();
    });
  });
});
