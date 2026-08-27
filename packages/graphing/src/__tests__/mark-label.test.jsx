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

    it('does not focus the input of an existing label when autoFocus is not set', () => {
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: 'A' } });

      expect(document.activeElement).not.toBe(input);
    });

    it('does not focus the input when disabled', () => {
      const { input } = renderComponent({ autoFocus: true, disabled: true, mark: { x: 1, y: 1, label: 'A' } });

      expect(document.activeElement).not.toBe(input);
    });

    it('does not focus the input of a disabled mark', () => {
      const { input } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: 'A', disabled: true } });

      expect(document.activeElement).not.toBe(input);
    });

    // the focus can go away without this component hearing about it - the input node gets replaced
    // by a render higher up, so no blur is fired and autoFocus is still on
    it('takes the focus back on the next render while it is still being edited', () => {
      const { input, rerenderWith } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: 'A' } });

      expect(document.activeElement).toBe(input);

      input.blur();
      expect(document.activeElement).not.toBe(input);

      rerenderWith({ mark: { x: 1, y: 1, label: 'A' } });

      expect(document.activeElement).toBe(input);
    });

    it('leaves the caret where the user put it while the input has the focus', () => {
      const { input, rerenderWith } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: 'ABC' } });

      input.setSelectionRange(1, 1);

      rerenderWith({ mark: { x: 1, y: 1, label: 'ABC' } });

      expect(document.activeElement).toBe(input);
      expect(input.selectionStart).toBe(1);
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

  // the tool asks for the focus with autoFocus, but its state can be gone before the input renders:
  // the marks come back from the host asynchronously and can remount the tool. An empty label in
  // label mode is a label the user has just added, so the input can tell on its own.
  describe('a label that was just added', () => {
    it('focuses itself without the tool asking', () => {
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: '' } });

      expect(document.activeElement).toBe(input);
    });

    it('focuses itself again when it is remounted before it was typed into', () => {
      const props = {
        onChange,
        onBlur,
        inputRef: jest.fn(),
        mark: { x: 1, y: 1, label: '' },
        graphProps: getGraphProps(0, 10, 0, 10),
      };
      const { container, rerender } = render(<MarkLabel key="first" {...props} />);
      const first = input(container);

      rerender(<MarkLabel key="second" {...props} />);
      const second = input(container);

      expect(second).not.toBe(first);
      expect(document.activeElement).toBe(second);
    });

    it('stops chasing the focus once it has been left', () => {
      const { input, rerenderWith } = renderComponent({ mark: { x: 1, y: 1, label: '' } });

      expect(document.activeElement).toBe(input);

      input.blur();
      rerenderWith({ mark: { x: 1, y: 1, label: '' } });

      expect(document.activeElement).not.toBe(input);
    });

    // outside of label mode the input is disabled, which is how an empty label that was loaded with
    // the item is told apart from one the user has just added - label mode always starts off
    // the config draws the background marks into the correct answer graphs as disabled marks
    it('is not rendered at all while it cannot be edited', () => {
      const { container } = renderComponent({ disabled: true, mark: { x: 1, y: 1, label: '' } });

      expect(container.querySelector('input')).toBe(null);
    });

    it('is still rendered uneditable once it has text', () => {
      const { container } = renderComponent({ disabled: true, mark: { x: 1, y: 1, label: 'A' } });

      expect(container.querySelector('input').value).toBe('A');
    });

    it('is not focused when label mode is turned on afterwards', () => {
      const { rerenderWith, container } = renderComponent({ disabled: true, mark: { x: 1, y: 1, label: '' } });

      rerenderWith({ disabled: false });

      expect(input(container)).not.toBe(null);
      expect(document.activeElement).not.toBe(input(container));
    });

    it('is not rendered for a disabled mark while it is empty', () => {
      const { container } = renderComponent({ mark: { x: 1, y: 1, label: '', disabled: true } });

      expect(container.querySelector('input')).toBe(null);
    });

    // an input sized to its content is 2px wide while it is empty, and chrome paints the caret of
    // an input inside an svg foreignObject as a hairline that never blinks - so an empty label that
    // has the focus has to be wide enough to be seen as a box waiting for text
    it('is wide enough to be seen while it is empty', () => {
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: '' } });

      expect(parseInt(input.style.width, 10)).toBeGreaterThanOrEqual(30);
    });

    it('is only as wide as its text once it cannot be edited', () => {
      const { container } = renderComponent({ disabled: true, mark: { x: 1, y: 1, label: 'A' } });

      expect(parseInt(container.querySelector('input').style.width, 10)).toBeLessThan(30);
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

  // the characters land at the document's caret, not at the focused node. In the authoring
  // environment the input ends up focused with no caret anywhere: keypress fires and nothing is
  // inserted. jsdom never reports a caret either, so this is that state - the focus cycle that
  // repairs it must not hand the label over to the blur handling.
  describe('a focused input with no caret', () => {
    it('is repaired without reporting the label as removed', () => {
      const { input } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: '' } });

      expect(document.activeElement).toBe(input);
      expect(onChange).not.toHaveBeenCalled();
      expect(onBlur).not.toHaveBeenCalled();
    });

    it('leaves the caret at the end of a label that already has text', () => {
      const { input } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: 'AB' } });

      expect(document.activeElement).toBe(input);
      expect(input.selectionStart).toBe(2);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // clicking another window, the devtools, or the host moving the focus while it saves the model:
  // the label is not being left, so it must survive and take the focus back
  describe('while the window is away', () => {
    const windowGoesAway = () => window.dispatchEvent(new Event('blur'));
    const windowComesBack = () => window.dispatchEvent(new Event('focus'));

    it('keeps an empty label instead of reporting it as removed', () => {
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: '' } });

      windowGoesAway();
      fireEvent.blur(input);

      expect(onChange).not.toHaveBeenCalled();
      expect(onBlur).not.toHaveBeenCalled();
    });

    it('takes the focus back when the window comes back', () => {
      const { input } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: '' } });

      // the focus is moved to another input rather than with input.blur(): jsdom fires a window
      // focus event as part of blur(), which is the very thing being tested here
      const elsewhere = document.createElement('input');

      document.body.appendChild(elsewhere);

      windowGoesAway();
      elsewhere.focus();
      expect(document.activeElement).toBe(elsewhere);

      windowComesBack();

      expect(document.activeElement).toBe(input);

      elsewhere.remove();
    });

    it('still reports a label the user leaves once the window is back', () => {
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: '' } });

      windowGoesAway();
      windowComesBack();
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('onBlur', () => {
    it('is called so the tool stops auto focusing the label', () => {
      const { input } = renderComponent({ autoFocus: true, mark: { x: 1, y: 1, label: 'A' } });

      fireEvent.blur(input);

      expect(onBlur).toHaveBeenCalled();
    });

    // clicking a button or anything else interactive blurs the label while the debounce is pending
    it('saves what was typed straight away', () => {
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: '' } });

      fireEvent.change(input, { target: { value: 'AB' } });
      fireEvent.blur(input);

      expect(onChange).toHaveBeenCalledWith('AB');
    });

    it('does not save it twice when the debounce catches up', () => {
      jest.useFakeTimers();
      const { input } = renderComponent({ mark: { x: 1, y: 1, label: '' } });

      fireEvent.change(input, { target: { value: 'AB' } });
      fireEvent.blur(input);
      act(() => jest.advanceTimersByTime(1000));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('AB');
      jest.useRealTimers();
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
