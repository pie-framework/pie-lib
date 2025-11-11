import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfigLayout from '../config-layout';

describe('ConfigLayout', () => {
  const settingsPanel = (
    <div data-testid="settings-panel">
      <div key={0}>Foo</div>
      <div key={1}>Bar</div>
    </div>
  );

  const children = (
    <div data-testid="main-content">
      <div>Foo</div>
      <div>Bar</div>
    </div>
  );

  describe('rendering', () => {
    it('renders correctly with settings panel', () => {
      render(<ConfigLayout settings={settingsPanel}>{children}</ConfigLayout>);

      expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('renders main content when provided', () => {
      render(<ConfigLayout settings={settingsPanel}>{children}</ConfigLayout>);

      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByText('Foo')).toBeInTheDocument();
      expect(screen.getAllByText('Bar')).toHaveLength(2); // One in settings, one in content
    });

    it('renders settings panel content', () => {
      render(<ConfigLayout settings={settingsPanel}>{children}</ConfigLayout>);

      const settingsContent = screen.getByTestId('settings-panel');
      expect(settingsContent).toBeInTheDocument();
    });

    it('renders without settings panel when not provided', () => {
      render(<ConfigLayout>{children}</ConfigLayout>);

      expect(screen.queryByTestId('settings-panel')).not.toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });
  });
});
