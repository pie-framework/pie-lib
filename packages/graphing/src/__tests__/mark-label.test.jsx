import { act, fireEvent, render } from '@pie-lib/test-utils';
import React from 'react';
import { coordinates, MarkLabel, position } from '../mark-label';
import { graphProps as getGraphProps } from './utils';

describe('MarkLabel', () => {
  let onChange = jest.fn();
  let inputRef = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      inputRef,
      mark: { x: 1, y: 1 },
      graphProps: getGraphProps(0, 10, 0, 10),
    };
    const props = { ...defaults, ...extras };
    return render(<MarkLabel {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
    it('renders with different mark position', () => {
      const { container } = renderComponent({ mark: { x: 10, y: 10 } });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('MarkLabel - editing', () => {
  let onChange;
  let onBlur;

  beforeEach(() => {
    onChange = jest.fn();
    onBlur = jest.fn();
  });

  // the label input is the only input MarkLabel renders (react-input-autosize)
  const input = (container) => container.querySelector('input');

  const renderComponent = (extras) => {
    const defaults = {
      onChange,
      onBlur,
      inputRef: jest.fn(),
      mark: { x: 1, y: 1, label: '' },
      graphProps: getGraphProps(0, 10, 0, 10),
    };
    const props = { ...defaults, ...extras };
    const result = render(<MarkLabel {...props} />);

    return {
      ...result,
      input: input(result.container),
      rerenderWith: (next) => result.rerender(<MarkLabel {...props} {...next} />),
    };
  };

  describe('autoFocus', () => {
    it('focuses the input so a new label can be typed into right away', () => {
      const { input } = renderComponent({ autoFocus: true });

      expect(document.activeElement).toBe(input);
    });

    it('leaves the caret at the end of an existing label', () => {
      const { input } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: 'AB' } });

      expect(document.activeElement).toBe(input);
      expect(input.selectionStart).toBe(2);
      expect(input.selectionEnd).toBe(2);
    });

    it('does not focus the input when autoFocus is not set', () => {
      const { input } = renderComponent();

      expect(document.activeElement).not.toBe(input);
    });

    it('does not focus the input when disabled', () => {
      const { input } = renderComponent({ autoFocus: true, disabled: true });

      expect(document.activeElement).not.toBe(input);
    });

    it('focuses the input once it is no longer disabled', () => {
      const { rerenderWith, container } = renderComponent({ autoFocus: true, disabled: true });

      rerenderWith({ disabled: false });

      expect(document.activeElement).toBe(input(container));
    });

    // the host saves the model with an api call and the model that comes back can replace the
    // input node - the label has to keep the focus across that remount
    it('re-focuses the input when it is remounted while being edited', () => {
      const props = {
        autoFocus: true,
        onChange,
        inputRef: jest.fn(),
        mark: { x: 1, y: 1, label: 'A' },
        graphProps: getGraphProps(0, 10, 0, 10),
      };
      const { container, rerender } = render(<MarkLabel key="first" {...props} />);
      const first = input(container);

      expect(document.activeElement).toBe(first);

      rerender(<MarkLabel key="second" {...props} />);
      const second = input(container);

      expect(second).not.toBe(first);
      expect(document.activeElement).toBe(second);
    });
  });

  describe('syncing mark.label into the input', () => {
    it('picks up a new mark.label while the input does not have the focus', () => {
      const { rerenderWith, container } = renderComponent({ mark: { x: 1, y: 1, label: 'A' } });

      rerenderWith({ mark: { x: 1, y: 1, label: 'updated' } });

      expect(input(container).value).toBe('updated');
    });

    // a mark coming back from an (async) model save can carry an older label - applying it would
    // wipe out the characters typed in the meantime
    it('keeps what the user typed while the input has the focus', () => {
      const { input, rerenderWith } = renderComponent({ autoFocus: true });

      expect(document.activeElement).toBe(input);

      fireEvent.change(input, { target: { value: 'AB' } });
      expect(input.value).toBe('AB');

      // the host echoes back the label as it was one keystroke ago
      rerenderWith({ mark: { x: 1, y: 1, label: 'A' } });

      expect(input.value).toBe('AB');
    });
  });

  describe('onBlur', () => {
    it('is called so the tool stops auto focusing the label', () => {
      const { input } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: 'A' } });

      fireEvent.blur(input);

      expect(onBlur).toHaveBeenCalled();
    });

    it('reports an empty label on blur', () => {
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: 'A' } });

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('debounce', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('does not report the typed label before the debounce delay elapses', () => {
      const { input } = renderComponent({ autoFocus: true });

      fireEvent.change(input, { target: { value: 'A' } });

      act(() => jest.advanceTimersByTime(499));
      expect(onChange).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(1));
      expect(onChange).toHaveBeenCalledWith('A');
    });

    it('reports the label once for a burst of keystrokes', () => {
      const { input } = renderComponent({ autoFocus: true });

      fireEvent.change(input, { target: { value: 'A' } });
      act(() => jest.advanceTimersByTime(300));
      fireEvent.change(input, { target: { value: 'AB' } });
      act(() => jest.advanceTimersByTime(300));
      fireEvent.change(input, { target: { value: 'ABC' } });
      act(() => jest.advanceTimersByTime(500));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('ABC');
    });
  });
});

describe('position', () => {
  const assertPosition = (mark, rect, expected) => {
    it(`${mark.x},${mark.y} + ${rect.width},${rect.height} => ${expected}`, () => {
      // we set range.min to a value because in pixels - the greater the Y the lower down on the screen.
      const graphProps = getGraphProps(0, 12, 12, 0);
      const result = position(graphProps, mark, rect);
      expect(result).toEqual(expected);
    });
  };

  assertPosition({ x: 0, y: 0 }, { width: 10, height: 10 }, 'top-left');
  assertPosition({ x: 0, y: 0 }, { width: 1, height: 1 }, 'bottom-right');
  assertPosition({ x: 0, y: 0 }, { width: 10, height: 0 }, 'bottom-left');
  assertPosition({ x: 0, y: 0 }, { width: 0, height: 10 }, 'top-right');
});

describe('coordinates', () => {
  const assertCoordinates = (mark, rect, pos, expected) => {
    it(`${mark.x}, ${mark.y} -> ${pos} = ${expected.left}, ${expected.top}`, () => {
      const result = coordinates(getGraphProps(), mark, rect, pos);
      expect(result).toEqual(expected);
    });
  };
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'top-left', { left: -5, top: -5 });
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'bottom-left', { left: -5, top: 5 });
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'top-right', { left: 5, top: -5 });
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'bottom-right', {
    left: 5,
    top: 5,
  });
});
