import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import PreviewComponent from '../preview-component';

// Mock @dnd-kit/core
jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
  useDndContext: jest.fn(() => ({
    active: null,
  })),
}));

// Mock @pie-lib/render-ui
jest.mock('@pie-lib/render-ui', () => ({
  PreviewPrompt: ({ prompt, className, tagName }) => {
    // Handle objects by converting to JSON string for testing purposes
    const displayPrompt = typeof prompt === 'object' ? JSON.stringify(prompt) : prompt;
    return (
      <span data-testid="preview-prompt" data-class={className} data-tag={tagName}>
        {displayPrompt}
      </span>
    );
  },
  color: {
    white: () => '#ffffff',
    text: () => '#000000',
    background: () => '#f5f5f5',
    borderDark: () => '#cccccc',
  },
}));

// Mock @pie-lib/math-rendering
jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn(),
}));

const { useDndContext } = require('@dnd-kit/core');
const { renderMath } = require('@pie-lib/math-rendering');

describe('PreviewComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset DOM for zoom detection
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    it('should render DragOverlay', () => {
      renderWithTheme(<PreviewComponent />);
      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });

    it('should not render content when not active', () => {
      useDndContext.mockReturnValue({ active: null });
      renderWithTheme(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should render content when active with prompt', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Test prompt',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByTestId('preview-prompt')).toBeInTheDocument();
      expect(screen.getByText('Test prompt')).toBeInTheDocument();
    });

    it('should not render if active but no prompt', () => {
      useDndContext.mockReturnValue({
        active: {
          data: { current: {} },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });
  });

  describe('getPrompt function', () => {
    it('should extract prompt from DraggableChoice format (choiceId)', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Choice value',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Choice value')).toBeInTheDocument();
    });

    it('should extract prompt from MaskBlank itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'MaskBlank',
              choice: { value: 'Blank value' },
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Blank value')).toBeInTheDocument();
    });

    it('should extract prompt from dnd-kit-response itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'dnd-kit-response',
              value: 'ICA value',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('ICA value')).toBeInTheDocument();
    });

    it('should extract prompt from Answer itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'Answer',
              value: 'Answer value',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Answer value')).toBeInTheDocument();
    });

    it('should extract prompt from Tile itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'Tile',
              value: 'Tile value',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Tile value')).toBeInTheDocument();
    });

    it('should extract prompt from categorize itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'categorize',
              value: 'Categorize value',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Categorize value')).toBeInTheDocument();
    });

    it('should fall back to value for unknown itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'unknown',
              value: 'Default value',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Default value')).toBeInTheDocument();
    });
  });

  describe('getCustomStyle function', () => {
    it('should apply maskBlank styles for MaskBlank itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'MaskBlank',
              choice: { value: 'Test' },
            },
          },
        },
      });

      const { container } = renderWithTheme(<PreviewComponent />);
      const styledDiv = container.querySelector('[style]');
      expect(styledDiv).toBeInTheDocument();
      // Check for some style properties
      const styles = styledDiv.getAttribute('style');
      expect(styles).toContain('cursor');
      expect(styles).toContain('opacity');
      expect(styles).toContain('transform');
    });

    it('should apply categorize styles for categorize itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'categorize',
              value: 'Test',
            },
          },
        },
      });

      const { container } = renderWithTheme(<PreviewComponent />);
      const styledDiv = container.querySelector('[style]');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should apply matchList styles for Answer itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'Answer',
              value: 'Test',
            },
          },
        },
      });

      const { container } = renderWithTheme(<PreviewComponent />);
      const styledDiv = container.querySelector('[style]');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should apply placementOrdering styles for Tile itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'Tile',
              value: 'Test',
            },
          },
        },
      });

      const { container } = renderWithTheme(<PreviewComponent />);
      const styledDiv = container.querySelector('[style]');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should apply ica styles for dnd-kit-response itemType', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'dnd-kit-response',
              value: 'Test',
            },
          },
        },
      });

      const { container } = renderWithTheme(<PreviewComponent />);
      const styledDiv = container.querySelector('[style]');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should apply default categorize styles for choiceId items', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Test',
            },
          },
        },
      });

      const { container } = renderWithTheme(<PreviewComponent />);
      const styledDiv = container.querySelector('[style]');
      expect(styledDiv).toBeInTheDocument();
    });
  });

  describe('renderMath integration', () => {
    it('should call renderMath when active', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Math expression',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(renderMath).toHaveBeenCalled();
    });

    it('should not call renderMath when not active', () => {
      useDndContext.mockReturnValue({ active: null });

      renderWithTheme(<PreviewComponent />);
      expect(renderMath).not.toHaveBeenCalled();
    });
  });

  describe('zoom level detection', () => {
    it('should detect zoom level from .padding element', () => {
      // Create a mock element with zoom
      const paddingElement = document.createElement('div');
      paddingElement.className = 'padding';
      document.body.appendChild(paddingElement);

      // Mock getComputedStyle to return zoom
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = jest.fn(() => ({ zoom: '1.5' }));

      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Test',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);

      // Cleanup
      window.getComputedStyle = originalGetComputedStyle;
      document.body.removeChild(paddingElement);
    });

    it('should default to document.body if no .padding element', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Test',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByTestId('preview-prompt')).toBeInTheDocument();
    });

    it('should handle missing zoom property', () => {
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = jest.fn(() => ({}));

      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Test',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);

      window.getComputedStyle = originalGetComputedStyle;
    });
  });

  describe('PreviewPrompt integration', () => {
    it('should render PreviewPrompt with correct props', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Test prompt',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      const previewPrompt = screen.getByTestId('preview-prompt');
      expect(previewPrompt).toHaveAttribute('data-class', 'label');
      expect(previewPrompt).toHaveAttribute('data-tag', 'span');
    });

    it('should pass prompt text to PreviewPrompt', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Complex prompt text',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Complex prompt text')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle null dragData', () => {
      useDndContext.mockReturnValue({
        active: {
          data: { current: null },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle undefined dragData', () => {
      useDndContext.mockReturnValue({
        active: {
          data: { current: undefined },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle dragData with missing value', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'categorize',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle empty string value', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: '',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      // Empty string is falsy, so no preview should render
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle MaskBlank without choice', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              itemType: 'MaskBlank',
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();
    });

    it('should handle complex object as value', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: { text: 'Complex value' },
            },
          },
        },
      });

      renderWithTheme(<PreviewComponent />);
      // PreviewPrompt should handle complex objects (our mock converts to JSON)
      expect(screen.getByTestId('preview-prompt')).toBeInTheDocument();
      expect(screen.getByText('{"text":"Complex value"}')).toBeInTheDocument();
    });
  });

  describe('state changes', () => {
    it('should update when active state changes', () => {
      // Reset to inactive state
      useDndContext.mockReturnValue({
        active: null,
      });

      const { rerender } = renderWithTheme(<PreviewComponent />);
      
      // Initially not active
      expect(screen.queryByTestId('preview-prompt')).not.toBeInTheDocument();

      // Update to active
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'New value',
            },
          },
        },
      });

      rerender(<PreviewComponent />);
      expect(screen.getByText('New value')).toBeInTheDocument();
    });

    it('should update when dragData changes', () => {
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-1',
              value: 'Initial value',
            },
          },
        },
      });

      const { rerender } = renderWithTheme(<PreviewComponent />);
      expect(screen.getByText('Initial value')).toBeInTheDocument();

      // Update dragData
      useDndContext.mockReturnValue({
        active: {
          data: {
            current: {
              choiceId: 'choice-2',
              value: 'Updated value',
            },
          },
        },
      });

      rerender(<PreviewComponent />);
      expect(screen.getByText('Updated value')).toBeInTheDocument();
    });
  });

  describe('different itemTypes with values', () => {
    const itemTypes = [
      { type: 'MaskBlank', key: 'choice', value: 'Mask value' },
      { type: 'dnd-kit-response', key: 'value', value: 'ICA value' },
      { type: 'Answer', key: 'value', value: 'Answer value' },
      { type: 'Tile', key: 'value', value: 'Tile value' },
      { type: 'categorize', key: 'value', value: 'Categorize value' },
    ];

    itemTypes.forEach(({ type, key, value }) => {
      it(`should render correctly for ${type} itemType`, () => {
        const dragData = { itemType: type };
        if (key === 'choice') {
          dragData.choice = { value };
        } else {
          dragData.value = value;
        }

        useDndContext.mockReturnValue({
          active: { data: { current: dragData } },
        });

        renderWithTheme(<PreviewComponent />);
        expect(screen.getByText(value)).toBeInTheDocument();
      });
    });
  });
});
