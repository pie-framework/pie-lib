import { EditorAndPad } from '../editor-and-pad';
import { render } from '@testing-library/react';
import React from 'react';

describe('EditorAndPad', () => {
  const defaultProps = {
    classes: {},
    classNames: {},
    onBlur: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    const { container } = render(<EditorAndPad {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('autoFocus', () => {
    it('focuses input immediately via setTimeout when autoFocus is true', () => {
      const mockFocus = jest.fn();
      const component = new EditorAndPad({ ...defaultProps, autoFocus: true });
      component.input = { focus: mockFocus };

      component.componentDidMount();

      expect(mockFocus).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(mockFocus).toHaveBeenCalledTimes(1);
    });

    it('does not focus input when autoFocus is false', () => {
      const mockFocus = jest.fn();
      const component = new EditorAndPad({ ...defaultProps, autoFocus: false });
      component.input = { focus: mockFocus };

      component.componentDidMount();
      jest.runAllTimers();

      expect(mockFocus).not.toHaveBeenCalled();
    });

    it('does not focus when input ref is not set', () => {
      const component = new EditorAndPad({ ...defaultProps, autoFocus: true });
      component.input = null;

      expect(() => {
        component.componentDidMount();
        jest.runAllTimers();
      }).not.toThrow();
    });

    it('uses setTimeout with 0ms delay to defer focus', () => {
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const mockFocus = jest.fn();
      const component = new EditorAndPad({ ...defaultProps, autoFocus: true });
      component.input = { focus: mockFocus };

      component.componentDidMount();

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);

      setTimeoutSpy.mockRestore();
    });
  });
});
