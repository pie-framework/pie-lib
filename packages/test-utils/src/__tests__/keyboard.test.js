import React from 'react';
import { render, screen } from '@testing-library/react';
import { Keys, pressKey, typeAndSubmit, clearAndType, navigateWithKeys } from '../keyboard';

describe('Keyboard helpers', () => {
  describe('Keys constant', () => {
    it('exports common key codes', () => {
      expect(Keys.ENTER).toBe(13);
      expect(Keys.ESCAPE).toBe(27);
      expect(Keys.SPACE).toBe(32);
      expect(Keys.TAB).toBe(9);
      expect(Keys.ARROW_DOWN).toBe(40);
    });
  });

  describe('pressKey', () => {
    it('dispatches keyboard event with keyCode', () => {
      const onKeyDown = jest.fn();
      render(<input onKeyDown={onKeyDown} />);
      const input = screen.getByRole('textbox');

      pressKey(input, Keys.ENTER);

      expect(onKeyDown).toHaveBeenCalled();
      const event = onKeyDown.mock.calls[0][0];
      expect(event.keyCode).toBe(13);
    });

    it('dispatches different event types', () => {
      const onKeyUp = jest.fn();
      render(<input onKeyUp={onKeyUp} />);
      const input = screen.getByRole('textbox');

      pressKey(input, Keys.ESCAPE, 'keyup');

      expect(onKeyUp).toHaveBeenCalled();
      const event = onKeyUp.mock.calls[0][0];
      expect(event.keyCode).toBe(27);
    });

    it('passes additional options', () => {
      const onKeyDown = jest.fn();
      render(<input onKeyDown={onKeyDown} />);
      const input = screen.getByRole('textbox');

      pressKey(input, Keys.ENTER, 'keydown', { ctrlKey: true });

      const event = onKeyDown.mock.calls[0][0];
      expect(event.ctrlKey).toBe(true);
    });
  });

  describe('typeAndSubmit', () => {
    it('types text and presses Enter', async () => {
      const onKeyDown = jest.fn();
      render(<input onKeyDown={onKeyDown} />);
      const input = screen.getByRole('textbox');

      await typeAndSubmit(input, 'hello');

      expect(input).toHaveValue('hello');
      expect(onKeyDown).toHaveBeenCalled();
      // Check that the last keyDown event was Enter
      const lastEvent = onKeyDown.mock.calls[onKeyDown.mock.calls.length - 1][0];
      expect(lastEvent.keyCode).toBe(Keys.ENTER);
    });
  });

  describe('clearAndType', () => {
    it('clears existing value and types new text', async () => {
      render(<input defaultValue="old value" />);
      const input = screen.getByRole('textbox');

      await clearAndType(input, 'new value');

      expect(input).toHaveValue('new value');
    });
  });

  describe('navigateWithKeys', () => {
    it('navigates down with arrow keys', () => {
      const onKeyDown = jest.fn();
      render(<div role="listbox" onKeyDown={onKeyDown} />);
      const listbox = screen.getByRole('listbox');

      navigateWithKeys(listbox, 3, 'vertical');

      expect(onKeyDown).toHaveBeenCalledTimes(3);
      const events = onKeyDown.mock.calls.map((call) => call[0].keyCode);
      expect(events).toEqual([Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys.ARROW_DOWN]);
    });

    it('navigates up with negative steps', () => {
      const onKeyDown = jest.fn();
      render(<div role="listbox" onKeyDown={onKeyDown} />);
      const listbox = screen.getByRole('listbox');

      navigateWithKeys(listbox, -2, 'vertical');

      expect(onKeyDown).toHaveBeenCalledTimes(2);
      const events = onKeyDown.mock.calls.map((call) => call[0].keyCode);
      expect(events).toEqual([Keys.ARROW_UP, Keys.ARROW_UP]);
    });

    it('navigates horizontally', () => {
      const onKeyDown = jest.fn();
      render(<div role="tablist" onKeyDown={onKeyDown} />);
      const tablist = screen.getByRole('tablist');

      navigateWithKeys(tablist, 2, 'horizontal');

      const events = onKeyDown.mock.calls.map((call) => call[0].keyCode);
      expect(events).toEqual([Keys.ARROW_RIGHT, Keys.ARROW_RIGHT]);
    });
  });
});
