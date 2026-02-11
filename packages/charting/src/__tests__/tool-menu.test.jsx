import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToolMenu, MiniButton } from '../tool-menu';

jest.mock('@pie-lib/translator', () => ({
  __esModule: true,
  default: {
    translator: {
      t: jest.fn((key, options) => {
        const translations = {
          'charting.addCategory': 'Add Category',
        };
        return translations[key] || key;
      }),
    },
  },
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000000',
    secondary: () => '#cccccc',
    background: () => '#ffffff',
    primary: () => '#0000ff',
    primaryDark: () => '#000080',
    disabled: () => '#f0f0f0',
  },
}));

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('MiniButton', () => {
  const onClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (extras = {}) => {
    const defaults = {
      value: 'Test Button',
      onClick,
      disabled: false,
      selected: false,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <MiniButton {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('should render with value text', () => {
      const { getByText } = renderComponent({ value: 'Click Me' });
      expect(getByText('Click Me')).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      const { getByRole } = renderComponent();
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should have correct button attributes', () => {
      const { getByRole } = renderComponent({ value: 'Test' });
      const button = getByRole('button');
      expect(button).toHaveAttribute('value', 'Test');
    });

    it('should render with variant outlined', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      expect(button).toHaveClass('MuiButton-outlined');
    });

    it('should render with size small', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      expect(button).toHaveClass('MuiButton-sizeSmall');
    });
  });

  describe('disabled state', () => {
    it('should render as disabled when disabled prop is true', () => {
      const { getByRole } = renderComponent({ disabled: true });
      expect(getByRole('button')).toBeDisabled();
    });

    it('should not render as disabled when disabled prop is false', () => {
      const { getByRole } = renderComponent({ disabled: false });
      expect(getByRole('button')).not.toBeDisabled();
    });

    it('should not trigger onClick when disabled', () => {
      const { getByRole } = renderComponent({ disabled: true });
      fireEvent.click(getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('selected state', () => {
    it('should apply selected styling when selected is true', () => {
      const { getByRole } = renderComponent({ selected: true });
      const button = getByRole('button');
      expect(button.className).toContain('MuiButton-colorSecondary');
    });

    it('should apply default color when selected is false', () => {
      const { getByRole } = renderComponent({ selected: false });
      const button = getByRole('button');
      expect(button.className).toContain('MuiButton-colorDefault');
    });

    it('should render correctly with both selected and disabled', () => {
      const { getByRole } = renderComponent({ selected: true, disabled: true });
      const button = getByRole('button');
      expect(button).toBeDisabled();
      expect(button.className).toContain('MuiButton-colorSecondary');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const { getByRole } = renderComponent();
      fireEvent.click(getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick with correct event when clicked', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
      expect(onClick.mock.calls[0][0]).toBeTruthy();
    });

    it('should handle multiple clicks', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid clicks', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      expect(onClick).toHaveBeenCalledTimes(10);
    });
  });

  describe('edge cases', () => {
    it('should render with empty string value', () => {
      const { getByRole } = renderComponent({ value: '' });
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should render with undefined onClick', () => {
      const { getByRole } = render(
        <ThemeProvider theme={theme}>
          <MiniButton value="Test" onClick={undefined} />
        </ThemeProvider>,
      );
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should render with null onClick', () => {
      const { getByRole } = render(
        <ThemeProvider theme={theme}>
          <MiniButton value="Test" onClick={null} />
        </ThemeProvider>,
      );
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should render with very long value text', () => {
      const longText = 'This is a very long button text that might cause layout issues';
      const { getByText } = renderComponent({ value: longText });
      expect(getByText(longText)).toBeInTheDocument();
    });

    it('should render with special characters in value', () => {
      const specialText = 'Test <>&"\'';
      const { getByText } = renderComponent({ value: specialText });
      expect(getByText(specialText)).toBeInTheDocument();
    });

    it('should render with unicode characters in value', () => {
      const unicodeText = 'Test 你好 🎉';
      const { getByText } = renderComponent({ value: unicodeText });
      expect(getByText(unicodeText)).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should accept className prop without error', () => {
      const { getByRole } = render(
        <ThemeProvider theme={theme}>
          <MiniButton value="Test" onClick={onClick} className="custom-class" />
        </ThemeProvider>,
      );
      expect(getByRole('button')).toBeInTheDocument();
    });
  });
});

describe('ToolMenu', () => {
  const addCategory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (extras = {}) => {
    const defaults = {
      addCategory,
      disabled: false,
      language: 'en',
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <ToolMenu {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('should render a div container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });

    it('should render MiniButton when not disabled', () => {
      const { getByRole } = renderComponent({ disabled: false });
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should not render MiniButton when disabled', () => {
      const { queryByRole } = renderComponent({ disabled: true });
      expect(queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render translated button text', () => {
      const { getByText } = renderComponent();
      expect(getByText('Add Category')).toBeInTheDocument();
    });

    it('should use language prop for translation', () => {
      const Translator = require('@pie-lib/translator').default;
      const { getByRole } = renderComponent({ language: 'es' });
      expect(getByRole('button')).toBeInTheDocument();
      expect(Translator.translator.t).toHaveBeenCalledWith('charting.addCategory', { lng: 'es' });
    });
  });

  describe('className prop', () => {
    it('should apply custom className to container', () => {
      const { container } = renderComponent({ className: 'custom-tool-menu' });
      expect(container.firstChild).toHaveClass('custom-tool-menu');
    });

    it('should render without className', () => {
      const { container } = renderComponent({ className: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty string className', () => {
      const { container } = renderComponent({ className: '' });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should hide button when disabled is true', () => {
      const { queryByRole } = renderComponent({ disabled: true });
      expect(queryByRole('button')).not.toBeInTheDocument();
    });

    it('should show button when disabled is false', () => {
      const { getByRole } = renderComponent({ disabled: false });
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should show button when disabled is undefined', () => {
      const { getByRole } = renderComponent({ disabled: undefined });
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should hide button when disabled is explicitly true', () => {
      const { queryByRole } = renderComponent({ disabled: true });
      expect(queryByRole('button')).toBeNull();
    });
  });

  describe('addCategory functionality', () => {
    it('should call addCategory when button is clicked', () => {
      const { getByRole } = renderComponent();
      fireEvent.click(getByRole('button'));
      expect(addCategory).toHaveBeenCalledTimes(1);
    });

    it('should not call addCategory when disabled', () => {
      const { queryByRole } = renderComponent({ disabled: true });
      expect(queryByRole('button')).not.toBeInTheDocument();
      expect(addCategory).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks on add category button', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(addCategory).toHaveBeenCalledTimes(3);
    });

    it('should render with undefined addCategory without crashing', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <ToolMenu addCategory={undefined} language="en" />
        </ThemeProvider>,
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('language prop', () => {
    it('should pass language to translator', () => {
      const Translator = require('@pie-lib/translator').default;
      renderComponent({ language: 'fr' });
      expect(Translator.translator.t).toHaveBeenCalledWith('charting.addCategory', { lng: 'fr' });
    });

    it('should handle default english language', () => {
      const Translator = require('@pie-lib/translator').default;
      renderComponent({ language: 'en' });
      expect(Translator.translator.t).toHaveBeenCalledWith('charting.addCategory', { lng: 'en' });
    });

    it('should handle undefined language', () => {
      const Translator = require('@pie-lib/translator').default;
      renderComponent({ language: undefined });
      expect(Translator.translator.t).toHaveBeenCalledWith('charting.addCategory', { lng: undefined });
    });

    it('should handle empty string language', () => {
      const Translator = require('@pie-lib/translator').default;
      renderComponent({ language: '' });
      expect(Translator.translator.t).toHaveBeenCalledWith('charting.addCategory', { lng: '' });
    });

    it('should handle non-standard language codes', () => {
      const Translator = require('@pie-lib/translator').default;
      renderComponent({ language: 'zh-CN' });
      expect(Translator.translator.t).toHaveBeenCalledWith('charting.addCategory', { lng: 'zh-CN' });
    });
  });

  describe('edge cases', () => {
    it('should render with all props undefined', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <ToolMenu />
        </ThemeProvider>,
      );
      expect(container).toBeInTheDocument();
    });

    it('should render with null props', () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <ToolMenu addCategory={null} disabled={null} language={null} />
        </ThemeProvider>,
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle component unmounting', () => {
      const { unmount } = renderComponent();
      expect(() => unmount()).not.toThrow();
    });

    it('should handle re-rendering with different props', () => {
      const { rerender, getByRole, queryByRole } = renderComponent({ disabled: false });
      expect(getByRole('button')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <ToolMenu addCategory={addCategory} disabled={true} language="en" />
        </ThemeProvider>,
      );
      expect(queryByRole('button')).not.toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <ToolMenu addCategory={addCategory} disabled={false} language="es" />
        </ThemeProvider>,
      );
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should handle rapid prop changes', () => {
      const { rerender, getByRole } = renderComponent({ disabled: false });

      expect(getByRole('button')).toBeInTheDocument();

      for (let i = 0; i < 10; i++) {
        rerender(
          <ThemeProvider theme={theme}>
            <ToolMenu addCategory={addCategory} disabled={i % 2 === 0} language="en" />
          </ThemeProvider>,
        );
      }

      expect(getByRole('button')).toBeInTheDocument();
    });
  });

  describe('component lifecycle', () => {
    it('should render as class component', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('should handle updates correctly', () => {
      const { rerender, getByRole } = renderComponent({ language: 'en' });
      expect(getByRole('button')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <ToolMenu addCategory={addCategory} disabled={false} language="fr" />
        </ThemeProvider>,
      );
      expect(getByRole('button')).toBeInTheDocument();
    });

    it('should cleanup properly on unmount', () => {
      const { unmount } = renderComponent();
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have accessible button element', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have button with text content', () => {
      const { getByRole } = renderComponent();
      const button = getByRole('button');
      expect(button).toHaveTextContent('Add Category');
    });

    it('should maintain button accessibility when enabled', () => {
      const { getByRole } = renderComponent({ disabled: false });
      const button = getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Add Category');
    });
  });

  describe('integration', () => {
    it('should work correctly with all props provided', () => {
      const customAddCategory = jest.fn();
      const { getByRole } = renderComponent({
        addCategory: customAddCategory,
        disabled: false,
        language: 'de',
        className: 'test-class',
      });

      const button = getByRole('button');
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(customAddCategory).toHaveBeenCalledTimes(1);
    });

    it('should toggle between enabled and disabled states', () => {
      const { rerender, getByRole, queryByRole } = renderComponent({ disabled: false });
      expect(getByRole('button')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <ToolMenu addCategory={addCategory} disabled={true} language="en" />
        </ThemeProvider>,
      );
      expect(queryByRole('button')).not.toBeInTheDocument();
    });

    it('should handle language switching', () => {
      const Translator = require('@pie-lib/translator').default;
      const { rerender } = renderComponent({ language: 'en' });

      rerender(
        <ThemeProvider theme={theme}>
          <ToolMenu addCategory={addCategory} disabled={false} language="es" />
        </ThemeProvider>,
      );

      expect(Translator.translator.t).toHaveBeenCalledWith('charting.addCategory', { lng: 'es' });
    });
  });
});
