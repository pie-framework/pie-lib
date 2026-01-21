import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import withStatefulModel from '../with-stateful-model';

const MockComponent = ({ model, onChange }) => (
  <div>
    <div data-testid="model-value">{JSON.stringify(model)}</div>
    <button onClick={() => onChange({ ...model, updated: true })}>Update Model</button>
  </div>
);

describe('withStatefulModel', () => {
  it('wraps component and passes model and onChange', () => {
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = { name: 'test' };
    const onChange = jest.fn();

    render(<WrappedComponent model={model} onChange={onChange} />);

    expect(screen.getByTestId('model-value')).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(model))).toBeInTheDocument();
  });

  it('manages local state with initial model prop', () => {
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = { id: 1, name: 'test' };

    render(<WrappedComponent model={model} onChange={jest.fn()} />);

    expect(screen.getByText(JSON.stringify(model))).toBeInTheDocument();
  });

  it('calls onChange with updated model when component calls onChange', async () => {
    const user = userEvent.setup();
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = { name: 'test' };
    const onChange = jest.fn();

    render(<WrappedComponent model={model} onChange={onChange} />);

    const updateButton = screen.getByRole('button', { name: /Update Model/i });
    await user.click(updateButton);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ updated: true }));
  });

  it('updates internal state when model prop changes', () => {
    const WrappedComponent = withStatefulModel(MockComponent);
    const initialModel = { name: 'initial' };
    const updatedModel = { name: 'updated' };
    const onChange = jest.fn();

    const { rerender } = render(
      <WrappedComponent model={initialModel} onChange={onChange} />
    );

    expect(screen.getByText(JSON.stringify(initialModel))).toBeInTheDocument();

    rerender(<WrappedComponent model={updatedModel} onChange={onChange} />);

    expect(screen.getByText(JSON.stringify(updatedModel))).toBeInTheDocument();
  });

  it('maintains state across multiple onChange calls', async () => {
    const user = userEvent.setup();
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = { count: 0 };
    const onChange = jest.fn();

    render(<WrappedComponent model={model} onChange={onChange} />);

    const updateButton = screen.getByRole('button', { name: /Update Model/i });

    await user.click(updateButton);
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(updateButton);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('passes updated model state to onChange callback', async () => {
    const user = userEvent.setup();
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = { value: 'original' };
    const onChange = jest.fn();

    render(<WrappedComponent model={model} onChange={onChange} />);

    const updateButton = screen.getByRole('button', { name: /Update Model/i });
    await user.click(updateButton);

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toHaveProperty('updated', true);
    expect(lastCall[0]).toHaveProperty('value', 'original');
  });

  it('handles empty model object', () => {
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = {};
    const onChange = jest.fn();

    render(<WrappedComponent model={model} onChange={onChange} />);

    expect(screen.getByText(JSON.stringify(model))).toBeInTheDocument();
  });

  it('handles model with nested properties', () => {
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = { user: { name: 'John', age: 30 }, settings: { theme: 'dark' } };
    const onChange = jest.fn();

    render(<WrappedComponent model={model} onChange={onChange} />);

    expect(screen.getByText(JSON.stringify(model))).toBeInTheDocument();
  });

  it('requires model and onChange props', () => {
    const WrappedComponent = withStatefulModel(MockComponent);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <WrappedComponent model={{ test: 'data' }} onChange={jest.fn()} />
    );

    expect(screen.getByTestId('model-value')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders wrapped component with correct props structure', () => {
    const WrappedComponent = withStatefulModel(MockComponent);
    const model = { id: 1 };
    const onChange = jest.fn();

    const { container } = render(
      <WrappedComponent model={model} onChange={onChange} />
    );

    expect(container.querySelector('[data-testid="model-value"]')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});
