import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CorrectnessIndicator, SmallCorrectPointIndicator, TickCorrectnessIndicator } from '../correctness-indicators';

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    correct: () => '#00ff00',
    incorrectWithIcon: () => '#ff0000',
    defaults: {
      WHITE: '#ffffff',
    },
  },
}));

jest.mock('@mui/icons-material/Check', () => {
  return function Check(props) {
    return <svg data-testid="check-icon" title={props.title} className={props.className} />;
  };
});

jest.mock('@mui/icons-material/Close', () => {
  return function Close(props) {
    return <svg data-testid="close-icon" title={props.title} className={props.className} />;
  };
});

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('CorrectnessIndicator', () => {
  const mockScale = {
    x: jest.fn((val) => val * 10),
    y: jest.fn((val) => val * 10),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (extras = {}) => {
    const defaults = {
      scale: mockScale,
      x: 5,
      y: 10,
      correctness: { value: 'correct', label: 'Correct Answer' },
      interactive: true,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <CorrectnessIndicator {...props} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('should render foreignObject element', () => {
      const { container } = renderComponent();
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
    });

    it('should render check icon for correct answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: 'Correct' },
      });
      expect(getByTestId('check-icon')).toBeInTheDocument();
    });

    it('should render close icon for incorrect answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'incorrect', label: 'Incorrect' },
      });
      expect(getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should not render when correctness is null', () => {
      const { container } = renderComponent({ correctness: null });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should not render when correctness is undefined', () => {
      const { container } = renderComponent({ correctness: undefined });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should not render when interactive is false', () => {
      const { container } = renderComponent({ interactive: false });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should render with correct title for correct answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: 'Well done!' },
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', 'Well done!');
    });

    it('should render with correct title for incorrect answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'incorrect', label: 'Try again' },
      });
      const icon = getByTestId('close-icon');
      expect(icon).toHaveAttribute('title', 'Try again');
    });
  });

  describe('positioning with scale', () => {
    it('should use scale to calculate position', () => {
      const { container } = renderComponent({
        scale: mockScale,
        x: 5,
        y: 10,
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(mockScale.x).toHaveBeenCalledWith(5);
      expect(mockScale.y).toHaveBeenCalledWith(10);
      // position is scaled value - 11 (half of 22px icon size)
      expect(foreignObject).toHaveAttribute('x', '39'); // 50 - 11
      expect(foreignObject).toHaveAttribute('y', '89'); // 100 - 11
    });

    it('should have correct size attributes', () => {
      const { container } = renderComponent();
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toHaveAttribute('width', '22');
      expect(foreignObject).toHaveAttribute('height', '22');
    });

    it('should handle different x and y values', () => {
      const { container } = renderComponent({
        x: 20,
        y: 30,
      });
      expect(mockScale.x).toHaveBeenCalledWith(20);
      expect(mockScale.y).toHaveBeenCalledWith(30);
    });

    it('should use raw values when scale is not provided', () => {
      const { container } = renderComponent({
        scale: null,
        x: 50,
        y: 100,
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toHaveAttribute('x', '39'); // 50 - 11
      expect(foreignObject).toHaveAttribute('y', '89'); // 100 - 11
    });
  });

  describe('edge cases', () => {
    it('should handle zero coordinates', () => {
      const { container } = renderComponent({
        x: 0,
        y: 0,
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toHaveAttribute('x', '-11');
      expect(foreignObject).toHaveAttribute('y', '-11');
    });

    it('should handle negative coordinates', () => {
      const { container } = renderComponent({
        x: -5,
        y: -10,
      });
      expect(mockScale.x).toHaveBeenCalledWith(-5);
      expect(mockScale.y).toHaveBeenCalledWith(-10);
    });

    it('should handle large coordinates', () => {
      const { container } = renderComponent({
        x: 1000,
        y: 2000,
      });
      expect(mockScale.x).toHaveBeenCalledWith(1000);
      expect(mockScale.y).toHaveBeenCalledWith(2000);
    });

    it('should handle correctness with empty label', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: '' },
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', '');
    });

    it('should handle correctness with undefined label', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: undefined },
      });
      expect(getByTestId('check-icon')).toBeInTheDocument();
    });

    it('should render when both correctness and interactive are true', () => {
      const { container } = renderComponent({
        correctness: { value: 'correct', label: 'Test' },
        interactive: true,
      });
      expect(container.querySelector('foreignObject')).toBeInTheDocument();
    });

    it('should not render when interactive is false even with correctness', () => {
      const { container } = renderComponent({
        correctness: { value: 'correct', label: 'Test' },
        interactive: false,
      });
      expect(container.querySelector('foreignObject')).not.toBeInTheDocument();
    });
  });
});

describe('SmallCorrectPointIndicator', () => {
  const mockScale = {
    x: jest.fn((val) => val * 10),
    y: jest.fn((val) => val * 10),
  };

  const correctData = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: '30' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (extras = {}) => {
    const defaults = {
      scale: mockScale,
      x: 5,
      correctness: { value: 'incorrect', label: 'Incorrect' },
      correctData,
      label: 'A',
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <SmallCorrectPointIndicator {...props} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('should render foreignObject when incorrect', () => {
      const { container } = renderComponent({
        correctness: { value: 'incorrect', label: 'Wrong' },
        label: 'A',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
    });

    it('should render small check icon when incorrect', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'incorrect', label: 'Wrong' },
        label: 'A',
      });
      const icon = getByTestId('check-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('small');
    });

    it('should not render when correctness is correct', () => {
      const { container } = renderComponent({
        correctness: { value: 'correct', label: 'Correct' },
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should not render when correctness is null', () => {
      const { container } = renderComponent({ correctness: null });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should not render when correctness is undefined', () => {
      const { container } = renderComponent({ correctness: undefined });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    it('should calculate correct position for label A', () => {
      const { container } = renderComponent({
        x: 5,
        label: 'A',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(mockScale.x).toHaveBeenCalledWith(5);
      expect(mockScale.y).toHaveBeenCalledWith(10); // value from correctData for label A
      // Position is scaled value - 7.5 (half of 15px small icon size)
      expect(foreignObject).toHaveAttribute('x', '42.5'); // 50 - 7.5
      expect(foreignObject).toHaveAttribute('y', '92.5'); // 100 - 7.5
    });

    it('should calculate correct position for label B', () => {
      const { container } = renderComponent({
        x: 5,
        label: 'B',
      });
      expect(mockScale.y).toHaveBeenCalledWith(20);
    });

    it('should calculate correct position for label C with string value', () => {
      const { container } = renderComponent({
        x: 5,
        label: 'C',
      });
      expect(mockScale.y).toHaveBeenCalledWith(30);
    });

    it('should have correct size attributes for small icon', () => {
      const { container } = renderComponent({
        label: 'A',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toHaveAttribute('width', '15');
      expect(foreignObject).toHaveAttribute('height', '15');
    });
  });

  describe('correctData handling', () => {
    it('should find correct value from correctData by label', () => {
      const { container } = renderComponent({
        label: 'B',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
      expect(mockScale.y).toHaveBeenCalledWith(20);
    });

    it('should not render when label is not in correctData', () => {
      const { container } = renderComponent({
        label: 'Z',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should not render when correctData value is NaN', () => {
      const { container } = renderComponent({
        correctData: [{ label: 'A', value: 'invalid' }],
        label: 'A',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should handle empty correctData array', () => {
      const { container } = renderComponent({
        correctData: [],
        label: 'A',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should not render when correctData is undefined (correctness not incorrect)', () => {
      const { container } = renderComponent({
        correctness: { value: 'correct', label: 'Correct' },
        correctData: undefined,
        label: 'A',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should parse string values correctly', () => {
      const { container } = renderComponent({
        correctData: [{ label: 'D', value: '45.5' }],
        label: 'D',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
      expect(mockScale.y).toHaveBeenCalledWith(45.5);
    });

    it('should handle zero values', () => {
      const { container } = renderComponent({
        correctData: [{ label: 'E', value: 0 }],
        label: 'E',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
      expect(mockScale.y).toHaveBeenCalledWith(0);
    });

    it('should handle negative values', () => {
      const { container } = renderComponent({
        correctData: [{ label: 'F', value: -10 }],
        label: 'F',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
      expect(mockScale.y).toHaveBeenCalledWith(-10);
    });
  });

  describe('icon properties', () => {
    it('should render icon with correct title', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'incorrect', label: 'Not quite right' },
        label: 'A',
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', 'Not quite right');
    });

    it('should render icon with small className', () => {
      const { getByTestId } = renderComponent({
        label: 'A',
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveClass('small');
    });
  });

  describe('edge cases', () => {
    it('should handle missing label prop', () => {
      const { container } = renderComponent({
        label: undefined,
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should handle empty string label', () => {
      const { container } = renderComponent({
        label: '',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('should handle very large values in correctData', () => {
      const { container } = renderComponent({
        correctData: [{ label: 'G', value: 999999 }],
        label: 'G',
      });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
      expect(mockScale.y).toHaveBeenCalledWith(999999);
    });

    it('should only render for incorrect answers', () => {
      const { container: incorrectContainer } = renderComponent({
        correctness: { value: 'incorrect', label: 'Wrong' },
        label: 'A',
      });
      expect(incorrectContainer.querySelector('foreignObject')).toBeInTheDocument();

      const { container: correctContainer } = renderComponent({
        correctness: { value: 'correct', label: 'Right' },
        label: 'A',
      });
      expect(correctContainer.querySelector('foreignObject')).not.toBeInTheDocument();
    });
  });
});

describe('TickCorrectnessIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (extras = {}) => {
    const defaults = {
      correctness: { value: 'correct', label: 'Correct Answer' },
      interactive: true,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <TickCorrectnessIndicator {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('should render check icon for correct answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: 'Correct' },
      });
      expect(getByTestId('check-icon')).toBeInTheDocument();
    });

    it('should render close icon for incorrect answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'incorrect', label: 'Incorrect' },
      });
      expect(getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should not render when correctness is null', () => {
      const { queryByTestId } = renderComponent({ correctness: null });
      expect(queryByTestId('check-icon')).not.toBeInTheDocument();
      expect(queryByTestId('close-icon')).not.toBeInTheDocument();
    });

    it('should not render when correctness is undefined', () => {
      const { queryByTestId } = renderComponent({ correctness: undefined });
      expect(queryByTestId('check-icon')).not.toBeInTheDocument();
      expect(queryByTestId('close-icon')).not.toBeInTheDocument();
    });

    it('should not render when interactive is false', () => {
      const { queryByTestId } = renderComponent({ interactive: false });
      expect(queryByTestId('check-icon')).not.toBeInTheDocument();
      expect(queryByTestId('close-icon')).not.toBeInTheDocument();
    });

    it('should render with correct title for correct answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: 'Great job!' },
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', 'Great job!');
    });

    it('should render with correct title for incorrect answer', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'incorrect', label: 'Not correct' },
      });
      const icon = getByTestId('close-icon');
      expect(icon).toHaveAttribute('title', 'Not correct');
    });
  });

  describe('interactive flag', () => {
    it('should render when interactive is true', () => {
      const { getByTestId } = renderComponent({
        interactive: true,
        correctness: { value: 'correct', label: 'Test' },
      });
      expect(getByTestId('check-icon')).toBeInTheDocument();
    });

    it('should not render when interactive is false', () => {
      const { queryByTestId } = renderComponent({
        interactive: false,
        correctness: { value: 'correct', label: 'Test' },
      });
      expect(queryByTestId('check-icon')).not.toBeInTheDocument();
    });

    it('should not render when interactive is undefined', () => {
      const { queryByTestId } = renderComponent({
        interactive: undefined,
        correctness: { value: 'correct', label: 'Test' },
      });
      expect(queryByTestId('check-icon')).not.toBeInTheDocument();
    });

    it('should not render when interactive is null', () => {
      const { queryByTestId } = renderComponent({
        interactive: null,
        correctness: { value: 'correct', label: 'Test' },
      });
      expect(queryByTestId('check-icon')).not.toBeInTheDocument();
    });
  });

  describe('correctness values', () => {
    it('should render check icon when value is "correct"', () => {
      const { getByTestId, queryByTestId } = renderComponent({
        correctness: { value: 'correct', label: 'Test' },
      });
      expect(getByTestId('check-icon')).toBeInTheDocument();
      expect(queryByTestId('close-icon')).not.toBeInTheDocument();
    });

    it('should render close icon when value is "incorrect"', () => {
      const { getByTestId, queryByTestId } = renderComponent({
        correctness: { value: 'incorrect', label: 'Test' },
      });
      expect(getByTestId('close-icon')).toBeInTheDocument();
      expect(queryByTestId('check-icon')).not.toBeInTheDocument();
    });

    it('should render close icon for any value other than "correct"', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'partial', label: 'Test' },
      });
      expect(getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should handle empty value string', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: '', label: 'Test' },
      });
      expect(getByTestId('close-icon')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle correctness with empty label', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: '' },
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', '');
    });

    it('should handle correctness with undefined label', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: undefined },
      });
      expect(getByTestId('check-icon')).toBeInTheDocument();
    });

    it('should handle correctness with null value', () => {
      const { queryByTestId } = renderComponent({
        correctness: { value: null, label: 'Test' },
      });
      expect(queryByTestId('close-icon')).toBeInTheDocument();
    });

    it('should require both correctness and interactive to render', () => {
      const { queryByTestId: query1 } = renderComponent({
        correctness: { value: 'correct', label: 'Test' },
        interactive: false,
      });
      expect(query1('check-icon')).not.toBeInTheDocument();

      const { queryByTestId: query2 } = renderComponent({
        correctness: null,
        interactive: true,
      });
      expect(query2('check-icon')).not.toBeInTheDocument();
    });

    it('should handle special characters in label', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: 'Test <>&"' },
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', 'Test <>&"');
    });

    it('should handle unicode characters in label', () => {
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: 'Test 你好 🎉' },
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', 'Test 你好 🎉');
    });

    it('should handle very long labels', () => {
      const longLabel = 'This is a very long label that might cause layout issues in the UI';
      const { getByTestId } = renderComponent({
        correctness: { value: 'correct', label: longLabel },
      });
      const icon = getByTestId('check-icon');
      expect(icon).toHaveAttribute('title', longLabel);
    });
  });

  describe('component consistency', () => {
    it('should render same icon type consistently for same correctness value', () => {
      const { getByTestId, unmount } = renderComponent({
        correctness: { value: 'correct', label: 'Test 1' },
      });

      expect(getByTestId('check-icon')).toBeInTheDocument();
      unmount();

      const { getByTestId: get2 } = renderComponent({
        correctness: { value: 'correct', label: 'Test 2' },
      });

      expect(get2('check-icon')).toBeInTheDocument();
    });

    it('should render different icons for different correctness values', () => {
      const { getByTestId, unmount } = renderComponent({
        correctness: { value: 'correct', label: 'Correct' },
      });

      expect(getByTestId('check-icon')).toBeInTheDocument();
      unmount();

      const { getByTestId: get2 } = renderComponent({
        correctness: { value: 'incorrect', label: 'Incorrect' },
      });

      expect(get2('close-icon')).toBeInTheDocument();
    });
  });
});
