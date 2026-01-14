import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../tabs';

describe('Tabs Component', () => {
  it('renders tabs with correct titles', () => {
    render(
      <Tabs>
        <div title="Tab 1">Content 1</div>
        <div title="Tab 2">Content 2</div>
        <div title="Tab 3">Content 3</div>
      </Tabs>,
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders first tab content by default', () => {
    render(
      <Tabs>
        <div title="Tab 1">Content 1</div>
        <div title="Tab 2">Content 2</div>
        <div title="Tab 3">Content 3</div>
      </Tabs>,
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('switches to selected tab when clicked', async () => {
    const user = userEvent.setup();
    render(
      <Tabs>
        <div title="Tab 1">Content 1</div>
        <div title="Tab 2">Content 2</div>
        <div title="Tab 3">Content 3</div>
      </Tabs>,
    );

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    await user.click(tab2);

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('displays correct content when multiple tabs are clicked', async () => {
    const user = userEvent.setup();
    render(
      <Tabs>
        <div title="Tab 1">Content 1</div>
        <div title="Tab 2">Content 2</div>
        <div title="Tab 3">Content 3</div>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tab 3' }));
    expect(screen.getByText('Content 3')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('applies custom className to root element', () => {
    const { container } = render(
      <Tabs className="custom-tabs-class">
        <div title="Tab 1">Content 1</div>
      </Tabs>,
    );

    const rootDiv = container.querySelector('.custom-tabs-class');
    expect(rootDiv).toBeInTheDocument();
  });


  it('handles tabs without title prop gracefully', () => {
    render(
      <Tabs>
        <div title="Tab 1">Content 1</div>
        <div>No Title Child</div>
        <div title="Tab 2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole('tab');
    // Should only have 2 tabs since one doesn't have a title
    expect(tabs).toHaveLength(2);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('handles null children gracefully', () => {
    render(
      <Tabs>
        <div title="Tab 1">Content 1</div>
        {null}
        <div title="Tab 2">Content 2</div>
      </Tabs>,
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
  });

  it('handles complex content in tabs', () => {
    render(
      <Tabs>
        <div title="Tab 1">
          <div>
            <h2>Tab 1 Header</h2>
            <p>Tab 1 description</p>
            <button>Button in Tab 1</button>
          </div>
        </div>
        <div title="Tab 2">
          <div>
            <h2>Tab 2 Header</h2>
            <input type="text" placeholder="Input in Tab 2" />
          </div>
        </div>
      </Tabs>,
    );

    expect(screen.getByText('Tab 1 Header')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Button in Tab 1' })).toBeInTheDocument();

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2).toBeInTheDocument();
  });

  it('renders all tabs in MuiTabs component', () => {
    const { container } = render(
      <Tabs>
        <div title="Tab A">Content A</div>
        <div title="Tab B">Content B</div>
        <div title="Tab C">Content C</div>
      </Tabs>,
    );

    const tabsComponent = container.querySelector('[role="tablist"]');
    expect(tabsComponent).toBeInTheDocument();
  });

  it('applies correct value prop to MuiTabs', async () => {
    const user = userEvent.setup();
    render(
      <Tabs>
        <div title="Tab 1">Content 1</div>
        <div title="Tab 2">Content 2</div>
      </Tabs>,
    );

    // Initially first tab should be selected (value 0)
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    expect(tab1).toHaveAttribute('aria-selected', 'true');

    // Click second tab
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(tab1).toHaveAttribute('aria-selected', 'false');
  });

  it('renders with empty children array', () => {
    const { container } = render(<Tabs>{[]}</Tabs>);
    expect(container).toBeInTheDocument();
  });

  it('handles long tab titles', () => {
    render(
      <Tabs>
        <div title="This is a very long tab title that should still render correctly">
          Content 1
        </div>
        <div title="Short">Content 2</div>
      </Tabs>,
    );

    expect(
      screen.getByText('This is a very long tab title that should still render correctly'),
    ).toBeInTheDocument();
    expect(screen.getByText('Short')).toBeInTheDocument();
  });
});
