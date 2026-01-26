import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import PreviewLayout from '../preview-layout';

jest.mock('../ui-layout', () => {
  return function UiLayout({ children, extraCSSRules, fontSizeFactor, classes, ...props }) {
    return (
      <div
        data-testid="ui-layout"
        data-extra-css-rules={extraCSSRules ? JSON.stringify(extraCSSRules) : undefined}
        data-font-size-factor={fontSizeFactor}
        data-classes={classes ? JSON.stringify(classes) : undefined}
        {...props}
      >
        {children}
      </div>
    );
  };
});

describe('PreviewLayout', () => {
  const defaultProps = {
    children: <div data-testid="child-content">Test Content</div>,
  };

  describe('rendering', () => {
    it('should render children correctly', () => {
      renderWithTheme(<PreviewLayout {...defaultProps} />);
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render UiLayout component', () => {
      renderWithTheme(<PreviewLayout {...defaultProps} />);
      expect(screen.getByTestId('ui-layout')).toBeInTheDocument();
    });

    it('should render with string children', () => {
      renderWithTheme(<PreviewLayout>Simple text content</PreviewLayout>);
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render with multiple children', () => {
      renderWithTheme(
        <PreviewLayout>
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
          <div data-testid="child-3">Third</div>
        </PreviewLayout>,
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render with array of children', () => {
      const children = [
        <div key="1" data-testid="array-child-1">
          First
        </div>,
        <div key="2" data-testid="array-child-2">
          Second
        </div>,
      ];
      renderWithTheme(<PreviewLayout>{children}</PreviewLayout>);
      expect(screen.getByTestId('array-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('array-child-2')).toBeInTheDocument();
    });
  });

  describe('accessibility props', () => {
    it('should apply aria-label and role when ariaLabel is provided', () => {
      renderWithTheme(
        <PreviewLayout ariaLabel="Test Label" role="region">
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('aria-label', 'Test Label');
      expect(uiLayout).toHaveAttribute('role', 'region');
    });

    it('should not apply accessibility attributes when ariaLabel is not provided', () => {
      renderWithTheme(
        <PreviewLayout role="region">
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).not.toHaveAttribute('aria-label');
      expect(uiLayout).not.toHaveAttribute('role');
    });

    it('should handle ariaLabel with role', () => {
      renderWithTheme(
        <PreviewLayout ariaLabel="Navigation" role="navigation">
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('aria-label', 'Navigation');
      expect(uiLayout).toHaveAttribute('role', 'navigation');
    });

    it('should handle different role values', () => {
      const roles = ['main', 'complementary', 'article', 'banner'];
      roles.forEach((role) => {
        const { unmount } = renderWithTheme(
          <PreviewLayout ariaLabel={`Test ${role}`} role={role}>
            <div>Content</div>
          </PreviewLayout>,
        );
        const uiLayout = screen.getByTestId('ui-layout');
        expect(uiLayout).toHaveAttribute('role', role);
        unmount();
      });
    });
  });

  describe('extraCSSRules prop', () => {
    it('should pass extraCSSRules to UiLayout', () => {
      const extraCSSRules = {
        names: ['rule1', 'rule2'],
        rules: '.custom { color: red; }',
      };
      renderWithTheme(
        <PreviewLayout extraCSSRules={extraCSSRules}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-extra-css-rules', JSON.stringify(extraCSSRules));
    });

    it('should handle extraCSSRules with empty names array', () => {
      const extraCSSRules = {
        names: [],
        rules: '.test { margin: 0; }',
      };
      renderWithTheme(
        <PreviewLayout extraCSSRules={extraCSSRules}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-extra-css-rules', JSON.stringify(extraCSSRules));
    });

    it('should handle extraCSSRules with multiple rule names', () => {
      const extraCSSRules = {
        names: ['header', 'footer', 'sidebar'],
        rules: '.header { padding: 10px; } .footer { margin: 5px; }',
      };
      renderWithTheme(
        <PreviewLayout extraCSSRules={extraCSSRules}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      const parsedRules = JSON.parse(uiLayout.getAttribute('data-extra-css-rules'));
      expect(parsedRules.names).toHaveLength(3);
      expect(parsedRules.names).toContain('header');
      expect(parsedRules.names).toContain('footer');
      expect(parsedRules.names).toContain('sidebar');
    });

    it('should work without extraCSSRules', () => {
      renderWithTheme(
        <PreviewLayout>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).not.toHaveAttribute('data-extra-css-rules');
    });
  });

  describe('fontSizeFactor prop', () => {
    it('should pass fontSizeFactor to UiLayout', () => {
      renderWithTheme(
        <PreviewLayout fontSizeFactor={1.5}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '1.5');
    });

    it('should handle fontSizeFactor of 1', () => {
      renderWithTheme(
        <PreviewLayout fontSizeFactor={1}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '1');
    });

    it('should handle fontSizeFactor less than 1', () => {
      renderWithTheme(
        <PreviewLayout fontSizeFactor={0.8}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '0.8');
    });

    it('should handle fontSizeFactor greater than 2', () => {
      renderWithTheme(
        <PreviewLayout fontSizeFactor={2.5}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '2.5');
    });
  });

  describe('classes prop', () => {
    it('should pass classes to UiLayout', () => {
      const classes = { root: 'custom-root', container: 'custom-container' };
      renderWithTheme(
        <PreviewLayout classes={classes}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-classes', JSON.stringify(classes));
    });
  });

  describe('all props together', () => {
    it('should handle all props simultaneously', () => {
      const extraCSSRules = {
        names: ['custom'],
        rules: '.custom { color: blue; }',
      };
      const classes = { root: 'test-root' };

      renderWithTheme(
        <PreviewLayout
          ariaLabel="Complete Layout"
          role="main"
          extraCSSRules={extraCSSRules}
          fontSizeFactor={1.2}
          classes={classes}
        >
          <div data-testid="all-props-child">All props content</div>
        </PreviewLayout>,
      );

      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('aria-label', 'Complete Layout');
      expect(uiLayout).toHaveAttribute('role', 'main');
      expect(uiLayout).toHaveAttribute('data-extra-css-rules', JSON.stringify(extraCSSRules));
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '1.2');
      expect(uiLayout).toHaveAttribute('data-classes', JSON.stringify(classes));
      expect(screen.getByTestId('all-props-child')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle null children gracefully', () => {
      renderWithTheme(<PreviewLayout>{null}</PreviewLayout>);
      expect(screen.getByTestId('ui-layout')).toBeInTheDocument();
    });

    it('should handle undefined children gracefully', () => {
      renderWithTheme(<PreviewLayout>{undefined}</PreviewLayout>);
      expect(screen.getByTestId('ui-layout')).toBeInTheDocument();
    });

    it('should handle empty string ariaLabel', () => {
      renderWithTheme(
        <PreviewLayout ariaLabel="" role="region">
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).not.toHaveAttribute('aria-label');
      expect(uiLayout).not.toHaveAttribute('role');
    });

    it('should handle zero fontSizeFactor', () => {
      renderWithTheme(
        <PreviewLayout fontSizeFactor={0}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '0');
    });

    it('should handle negative fontSizeFactor', () => {
      renderWithTheme(
        <PreviewLayout fontSizeFactor={-1}>
          <div>Content</div>
        </PreviewLayout>,
      );
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '-1');
    });
  });

  describe('re-rendering', () => {
    it('should update when props change', () => {
      const { rerender } = renderWithTheme(
        <PreviewLayout ariaLabel="Initial" role="region">
          <div data-testid="content">Initial content</div>
        </PreviewLayout>,
      );

      expect(screen.getByText('Initial content')).toBeInTheDocument();
      const uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('aria-label', 'Initial');

      rerender(
        <PreviewLayout ariaLabel="Updated" role="main">
          <div data-testid="content">Updated content</div>
        </PreviewLayout>,
      );

      expect(screen.getByText('Updated content')).toBeInTheDocument();
      expect(uiLayout).toHaveAttribute('aria-label', 'Updated');
      expect(uiLayout).toHaveAttribute('role', 'main');
    });

    it('should update fontSizeFactor dynamically', () => {
      const { rerender } = renderWithTheme(
        <PreviewLayout fontSizeFactor={1}>
          <div>Content</div>
        </PreviewLayout>,
      );

      let uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '1');

      rerender(
        <PreviewLayout fontSizeFactor={2}>
          <div>Content</div>
        </PreviewLayout>,
      );

      uiLayout = screen.getByTestId('ui-layout');
      expect(uiLayout).toHaveAttribute('data-font-size-factor', '2');
    });
  });
});
