import React from 'react';
import { render, screen } from '@testing-library/react';
import PreviewComponent from '../preview-component';

jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
  useDndContext: jest.fn(),
}));

jest.mock('@pie-lib/render-ui', () => ({
  PreviewPrompt: ({ prompt, className, tagName }) => (
    <span data-testid="preview-prompt" data-class={className} data-tag={tagName}>
      {prompt}
    </span>
  ),
  color: {
    white: () => '#ffffff',
    text: () => '#000000',
    background: () => 'rgba(255,255,255,0)',
    borderDark: () => '#646464',
  },
}));

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

describe('PreviewComponent', () => {
  const { useDndContext } = require('@dnd-kit/core');
  const { renderMath } = require('@pie-lib/math-rendering');

  beforeEach(() => {
    jest.clearAllMocks();
    window.getComputedStyle = jest.fn().mockReturnValue({ zoom: '1' });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('rendering without active drag', () => {
    it('should render DragOverlay when not dragging', () => {
      useDndContext.mockReturnValue({ active: null });
      render(<PreviewComponent />);
      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });

    it('should not render preview content when not dragging', () => {
      useDndContext.mockReturnValue({ active: null });
      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should render empty DragOverlay when active is undefined', () => {
      useDndContext.mockReturnValue({ active: undefined });
      render(<PreviewComponent />);
      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });
  });

  describe('rendering with active drag', () => {
    it('should render preview when dragging with choiceId format', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'choice-1',
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Dragging Choice',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByTestId('preview-prompt')).toBeInTheDocument();
      expect(screen.getByText('Dragging Choice')).toBeInTheDocument();
    });

    it('should render preview when dragging with MaskBlank itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'mask-1',
          data: {
            current: {
              itemType: 'MaskBlank',
              choice: { value: 'Mask Blank Value' },
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Mask Blank Value')).toBeInTheDocument();
    });

    it('should render preview with dnd-kit-response itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'response-1',
          data: {
            current: {
              itemType: 'dnd-kit-response',
              value: 'Response Value',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Response Value')).toBeInTheDocument();
    });

    it('should render preview with Answer itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'answer-1',
          data: {
            current: {
              itemType: 'Answer',
              value: 'Answer Value',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Answer Value')).toBeInTheDocument();
    });

    it('should render preview with Tile itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'tile-1',
          data: {
            current: {
              itemType: 'Tile',
              value: 'Tile Value',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Tile Value')).toBeInTheDocument();
    });

    it('should render preview with categorize itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'cat-1',
          data: {
            current: {
              itemType: 'categorize',
              value: 'Category Value',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Category Value')).toBeInTheDocument();
    });

    it('should render preview with default itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'default-1',
          data: {
            current: {
              itemType: 'unknown',
              value: 'Default Value',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Default Value')).toBeInTheDocument();
    });
  });

  describe('PreviewPrompt integration', () => {
    it('should pass correct props to PreviewPrompt', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'test-1',
          data: {
            current: {
              value: 'Test Prompt',
            },
          },
        },
      });

      render(<PreviewComponent />);
      const previewPrompt = screen.getByTestId('preview-prompt');
      expect(previewPrompt).toHaveAttribute('data-class', 'label');
      expect(previewPrompt).toHaveAttribute('data-tag', 'span');
    });

    it('should render PreviewPrompt with HTML content', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'html-1',
          data: {
            current: {
              value: '<strong>Bold Text</strong>',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByTestId('preview-prompt')).toBeInTheDocument();
    });
  });

  describe('math rendering', () => {
    it('should call renderMath when dragging starts', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'math-1',
          data: {
            current: {
              value: 'x^2 + y^2 = r^2',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(renderMath).toHaveBeenCalled();
    });

    it('should not call renderMath when not dragging', () => {
      useDndContext.mockReturnValue({ active: null });
      render(<PreviewComponent />);
      expect(renderMath).not.toHaveBeenCalled();
    });

    it('should pass correct element to renderMath', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'math-2',
          data: {
            current: {
              value: 'Math Expression',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(renderMath).toHaveBeenCalledWith(expect.any(HTMLElement));
    });
  });

  describe('zoom level detection', () => {
    it('should detect zoom level from .padding element', () => {
      // Create a mock element with zoom
      const mockElement = document.createElement('div');
      mockElement.className = 'padding';
      document.body.appendChild(mockElement);

      window.getComputedStyle = jest.fn().mockReturnValue({ zoom: '1.5' });

      useDndContext.mockReturnValue({
        active: {
          id: 'zoom-1',
          data: {
            current: {
              value: 'Zoomed Content',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(window.getComputedStyle).toHaveBeenCalled();
    });

    it('should fallback to body if .padding element not found', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({ zoom: '1' });

      useDndContext.mockReturnValue({
        active: {
          id: 'zoom-2',
          data: {
            current: {
              value: 'Content',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(window.getComputedStyle).toHaveBeenCalled();
    });

    it('should handle missing zoom value', () => {
      window.getComputedStyle = jest.fn().mockReturnValue({});

      useDndContext.mockReturnValue({
        active: {
          id: 'zoom-3',
          data: {
            current: {
              value: 'No Zoom Content',
            },
          },
        },
      });

      expect(() => render(<PreviewComponent />)).not.toThrow();
    });
  });

  describe('style application', () => {
    it('should apply base style to preview', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'style-1',
          data: {
            current: {
              value: 'Styled Content',
            },
          },
        },
      });

      const { container } = render(<PreviewComponent />);
      const styledDiv = container.querySelector('[style]');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should not render without prompt value', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'no-prompt',
          data: {
            current: {
              itemType: 'test',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty string value', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'empty',
          data: {
            current: {
              value: '',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle null value', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'null',
          data: {
            current: {
              value: null,
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle undefined value', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'undefined',
          data: {
            current: {
              value: undefined,
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle missing data.current', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'no-data',
          data: {},
        },
      });

      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle MaskBlank without choice', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'mask-no-choice',
          data: {
            current: {
              itemType: 'MaskBlank',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle MaskBlank with null choice', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'mask-null-choice',
          data: {
            current: {
              itemType: 'MaskBlank',
              choice: null,
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });
  });

  describe('re-rendering', () => {
    it('should update when drag state changes', () => {
      useDndContext.mockReturnValue({ active: null });
      const { rerender } = render(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();

      useDndContext.mockReturnValue({
        active: {
          id: 'new-active',
          data: {
            current: {
              value: 'New Active Content',
            },
          },
        },
      });

      rerender(<PreviewComponent />);
      expect(screen.getByText('New Active Content')).toBeInTheDocument();
    });

    it('should call renderMath on each update when dragging', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'math-update',
          data: {
            current: {
              value: 'Initial Math',
            },
          },
        },
      });

      const { rerender } = render(<PreviewComponent />);
      const initialCallCount = renderMath.mock.calls.length;

      useDndContext.mockReturnValue({
        active: {
          id: 'math-update',
          data: {
            current: {
              value: 'Updated Math',
            },
          },
        },
      });

      rerender(<PreviewComponent />);
      expect(renderMath.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('different drag data formats', () => {
    it('should handle legacy format with only value', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'legacy',
          data: {
            current: {
              value: 'Legacy Value',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Legacy Value')).toBeInTheDocument();
    });

    it('should prioritize choiceId format over itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          id: 'priority',
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Choice Value',
              itemType: 'categorize',
            },
          },
        },
      });

      render(<PreviewComponent />);
      expect(screen.getByText('Choice Value')).toBeInTheDocument();
    });
  });
});
