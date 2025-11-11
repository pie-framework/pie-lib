import * as React from 'react';
import { renderWithTheme, renderWithProviders, screen, createTestTheme } from '../index';
import { Button } from '@mui/material';

describe('@pie-lib/test-utils', () => {
  describe('renderWithTheme', () => {
    it('renders a component with default MUI theme', () => {
      renderWithTheme(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders a component with custom theme', () => {
      const customTheme = createTestTheme({
        palette: {
          primary: {
            main: '#ff0000',
          },
        },
      });

      renderWithTheme(<Button color="primary">Themed Button</Button>, {
        theme: customTheme,
      });

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('accepts additional render options', () => {
      const { container } = renderWithTheme(<Button>Test</Button>, {
        container: document.body,
      });

      expect(container).toBe(document.body);
    });
  });

  describe('renderWithProviders', () => {
    it('renders with theme provider by default', () => {
      renderWithProviders(<Button>Provided Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with additional providers', () => {
      const TestProvider = ({ children }) => (
        <div data-testid="test-provider">{children}</div>
      );

      renderWithProviders(<Button>Multi Provider</Button>, {
        providers: [TestProvider],
      });

      expect(screen.getByTestId('test-provider')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('createTestTheme', () => {
    it('creates a theme with custom options', () => {
      const theme = createTestTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#90caf9',
          },
        },
      });

      expect(theme.palette.mode).toBe('dark');
      expect(theme.palette.primary.main).toBe('#90caf9');
    });

    it('creates a theme with default options when none provided', () => {
      const theme = createTestTheme();
      expect(theme.palette).toBeDefined();
      expect(theme.spacing).toBeDefined();
    });
  });

  describe('RTL re-exports', () => {
    it('exports screen utility', () => {
      renderWithTheme(<div>Test Content</div>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('exports render function', async () => {
      const { render, screen: screenImport } = await import('../index');
      render(<div>Direct Render</div>);
      expect(screenImport.getByText('Direct Render')).toBeInTheDocument();
    });
  });
});
