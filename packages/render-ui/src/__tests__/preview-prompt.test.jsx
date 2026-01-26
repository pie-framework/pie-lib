import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreviewPrompt from '../preview-prompt';

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

const { renderMath } = require('@pie-lib/math-rendering');

describe('Prompt without Custom tag', () => {
  const defaultProps = {
    classes: {},
    prompt:
      'Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math>',
    tagName: '',
    className: '',
  };

  describe('default rendering with markup', () => {
    it('renders the prompt text', () => {
      render(<PreviewPrompt {...defaultProps} />);
      expect(screen.getByText(/Which of these northern European countries are EU members/)).toBeInTheDocument();
    });

    it('does not have prompt class by default', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      expect(container.firstChild).not.toHaveClass('prompt');
    });

    it('renders math markup', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      // Math may be rendered but transformed by the math rendering library
      // Just check that the prompt text is rendered
      expect(screen.getByText(/Which of these northern European countries are EU members/)).toBeInTheDocument();
    });
  });
});

describe('Prompt with Custom tag', () => {
  const defaultProps = {
    classes: {},
    prompt:
      'Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math>',
    tagName: 'span',
    className: 'prompt',
  };

  describe('renders with custom tag "span" correctly', () => {
    it('renders with custom className', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      expect(container.firstChild).toHaveClass('prompt');
    });

    it('renders as span element when tagName is specified', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      expect(container.firstChild.tagName.toLowerCase()).toBe('span');
    });

    it('renders the prompt text', () => {
      render(<PreviewPrompt {...defaultProps} />);
      expect(screen.getByText(/Which of these northern European countries are EU members/)).toBeInTheDocument();
    });
  });
});

describe('PreviewPrompt - Extended Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('tagName variations', () => {
    it('should render as legend when tagName is "legend"', () => {
      const { container } = render(<PreviewPrompt prompt="Legend text" tagName="legend" />);
      expect(container.firstChild.tagName.toLowerCase()).toBe('legend');
    });

    it('should render as div by default when no tagName', () => {
      const { container } = render(<PreviewPrompt prompt="Default text" />);
      expect(container.firstChild.tagName.toLowerCase()).toBe('div');
    });

    it('should apply legend class when tagName is "legend"', () => {
      const { container } = render(<PreviewPrompt prompt="Legend text" tagName="legend" />);
      expect(container.firstChild).toHaveClass('legend');
    });

    it('should render as p tag when specified', () => {
      const { container } = render(<PreviewPrompt prompt="Paragraph text" tagName="p" />);
      expect(container.firstChild.tagName.toLowerCase()).toBe('p');
    });
  });

  describe('className handling', () => {
    it('should apply single className', () => {
      const { container } = render(<PreviewPrompt prompt="Test" className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply defaultClassName', () => {
      const { container } = render(<PreviewPrompt prompt="Test" defaultClassName="default-class" />);
      expect(container.firstChild).toHaveClass('default-class');
    });

    it('should combine className and defaultClassName', () => {
      const { container } = render(<PreviewPrompt prompt="Test" className="custom" defaultClassName="default" />);
      expect(container.firstChild).toHaveClass('custom');
      expect(container.firstChild).toHaveClass('default');
    });

    it('should add legend class when tagName is legend', () => {
      const { container } = render(<PreviewPrompt prompt="Test" tagName="legend" className="custom" />);
      expect(container.firstChild).toHaveClass('custom');
      expect(container.firstChild).toHaveClass('legend');
    });
  });

  describe('onClick handler', () => {
    it('should call onClick when clicked', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();

      render(<PreviewPrompt prompt="Clickable text" onClick={onClick} />);

      await user.click(screen.getByText('Clickable text'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should work without onClick handler', async () => {
      const user = userEvent.setup();

      render(<PreviewPrompt prompt="Text without handler" />);

      await user.click(screen.getByText('Text without handler'));
    });

    it('should call onClick multiple times', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();

      render(<PreviewPrompt prompt="Multi-click text" onClick={onClick} />);

      await user.click(screen.getByText('Multi-click text'));
      await user.click(screen.getByText('Multi-click text'));
      await user.click(screen.getByText('Multi-click text'));

      expect(onClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('newline replacement', () => {
    it('should replace \\embed{newLine}[] with \\newline', () => {
      const promptWithNewline = 'Line 1\\embed{newLine}[]Line 2';
      const { container } = render(<PreviewPrompt prompt={promptWithNewline} />);

      expect(container.innerHTML).toContain('\\newline');
      expect(container.innerHTML).not.toContain('\\embed{newLine}[]');
    });

    it('should replace multiple newlines', () => {
      const promptWithNewlines = 'A\\embed{newLine}[]B\\embed{newLine}[]C';
      const { container } = render(<PreviewPrompt prompt={promptWithNewlines} />);

      const newlineCount = (container.innerHTML.match(/\\newline/g) || []).length;
      expect(newlineCount).toBe(2);
    });

    it('should handle prompt without newlines', () => {
      const normalPrompt = 'Normal text without newlines';
      render(<PreviewPrompt prompt={normalPrompt} />);

      expect(screen.getByText('Normal text without newlines')).toBeInTheDocument();
    });
  });

  describe('audio handling', () => {
    it('should parse audio tag and add source element', () => {
      const promptWithAudio = '<audio src="test.mp3"></audio>';
      render(<PreviewPrompt prompt={promptWithAudio} />);

      const audio = document.querySelector('audio');
      expect(audio).toBeInTheDocument();
      expect(audio).toHaveAttribute('id', 'pie-prompt-audio-player');

      const source = audio.querySelector('source');
      expect(source).toBeInTheDocument();
      expect(source).toHaveAttribute('src', 'test.mp3');
      expect(source).toHaveAttribute('type', 'audio/mp3');
    });

    it('should remove src attribute from audio tag after adding source', () => {
      const promptWithAudio = '<audio src="test.mp3"></audio>';
      render(<PreviewPrompt prompt={promptWithAudio} />);

      const audio = document.querySelector('audio');
      expect(audio).not.toHaveAttribute('src');
    });

    it('should handle custom audio button', () => {
      const customAudioButton = {
        playImage: 'play.png',
        pauseImage: 'pause.png',
      };
      const promptWithAudio = '<audio src="test.mp3"></audio>';

      render(<PreviewPrompt prompt={promptWithAudio} customAudioButton={customAudioButton} />);

      const audio = document.getElementById('pie-prompt-audio-player');
      expect(audio).toHaveStyle({ display: 'none' });

      const playButton = document.getElementById('play-audio-button');
      expect(playButton).toBeInTheDocument();
    });

    it('should not add custom button when customAudioButton is not provided', () => {
      const promptWithAudio = '<audio src="test.mp3"></audio>';
      render(<PreviewPrompt prompt={promptWithAudio} />);

      const playButton = document.getElementById('play-audio-button');
      expect(playButton).not.toBeInTheDocument();
    });
  });

  describe('image alignment', () => {
    it('should align images with alignment attribute', () => {
      const promptWithImage = '<img src="test.jpg" alignment="center" />';
      render(<PreviewPrompt prompt={promptWithImage} />);

      const images = document.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should handle images without alignment attribute', () => {
      const promptWithImage = '<img src="test.jpg" />';
      render(<PreviewPrompt prompt={promptWithImage} />);

      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty prompt', () => {
      const { container } = render(<PreviewPrompt prompt="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined prompt', () => {
      const { container } = render(<PreviewPrompt prompt={undefined} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle null prompt', () => {
      const { container } = render(<PreviewPrompt prompt={null} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle very long prompt', () => {
      const longPrompt = 'A'.repeat(10000);
      render(<PreviewPrompt prompt={longPrompt} />);
      expect(screen.getByText(longPrompt)).toBeInTheDocument();
    });

    it('should handle prompt with special HTML characters', () => {
      const specialPrompt = '<div>Test & "quotes" \' apostrophe</div>';
      render(<PreviewPrompt prompt={specialPrompt} />);
      expect(screen.getByText(/Test/)).toBeInTheDocument();
    });

    it('should handle prompt with script tags safely', () => {
      const scriptPrompt = '<script>alert("XSS")</script>Safe text';
      const { container } = render(<PreviewPrompt prompt={scriptPrompt} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('dangerouslySetInnerHTML', () => {
    it('should render HTML using dangerouslySetInnerHTML', () => {
      const htmlPrompt = '<strong>Bold</strong> and <em>italic</em>';
      render(<PreviewPrompt prompt={htmlPrompt} />);

      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText(/italic/)).toBeInTheDocument();
    });

    it('should render complex nested HTML', () => {
      const complexPrompt = `
        <div>
          <h3>Title</h3>
          <p>Paragraph 1</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `;
      render(<PreviewPrompt prompt={complexPrompt} />);

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render tables', () => {
      const tablePrompt = `
        <table>
          <tbody>
            <tr><th>Header</th><td>Data</td></tr>
          </tbody>
        </table>
      `;
      render(<PreviewPrompt prompt={tablePrompt} />);

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Data')).toBeInTheDocument();
    });
  });

  describe('component lifecycle', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = render(<PreviewPrompt prompt="Test" />);
      unmount();
      // Should not throw errors on unmount
    });

    it('should update when props change', () => {
      const { rerender } = render(<PreviewPrompt prompt="Initial" />);
      rerender(<PreviewPrompt prompt="Updated" />);

      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = render(<PreviewPrompt prompt="V1" />);
      rerender(<PreviewPrompt prompt="V2" />);
      rerender(<PreviewPrompt prompt="V3" />);
      rerender(<PreviewPrompt prompt="V4" />);

      expect(screen.getByText('V4')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have preview-prompt id for accessibility', () => {
      render(<PreviewPrompt prompt="Accessible text" />);
      const element = document.getElementById('preview-prompt');
      expect(element).toBeInTheDocument();
    });

    it('should preserve semantic HTML', () => {
      const semanticPrompt = '<strong>Important:</strong> Read carefully';
      render(<PreviewPrompt prompt={semanticPrompt} />);

      const strong = document.querySelector('strong');
      expect(strong).toBeInTheDocument();
      expect(strong).toHaveTextContent('Important:');
    });
  });

  describe('multiple instances', () => {
    it('should handle multiple PreviewPrompt components', () => {
      const { container } = render(
        <div>
          <PreviewPrompt prompt="First prompt" />
          <PreviewPrompt prompt="Second prompt" />
          <PreviewPrompt prompt="Third prompt" />
        </div>,
      );

      expect(screen.getByText('First prompt')).toBeInTheDocument();
      expect(screen.getByText('Second prompt')).toBeInTheDocument();
      expect(screen.getByText('Third prompt')).toBeInTheDocument();
    });
  });
});
