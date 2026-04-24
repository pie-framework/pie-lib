import React from 'react';
import { render, screen } from '@testing-library/react';
import HorizontalKeypad from '../horizontal-keypad';

jest.mock('../keypad', () => {
  return function Keypad({
    className,
    controlledKeypadMode,
    onFocus,
    noDecimal,
    layoutForKeyPad,
    additionalKeys,
    onPress,
    mode,
    setKeypadInteraction,
  }) {
    const attrs = {
      'data-testid': 'keypad',
      'data-controlled-mode': controlledKeypadMode,
      'data-has-focus': !!onFocus,
      'data-no-decimal': noDecimal,
      'data-has-layout': !!layoutForKeyPad,
      'data-additional-keys-length': additionalKeys?.length || 0,
      'data-mode': mode,
      'data-has-interaction': !!setKeypadInteraction,
    };

    if (className !== undefined) {
      attrs['data-class'] = className;
    }

    return (
      <div {...attrs} onClick={() => onPress && onPress({ command: 'test' })}>
        Keypad Mock
      </div>
    );
  };
});

jest.mock('../keys/grades', () => ({
  keysForGrade: jest.fn((mode) => {
    return [[{ name: 'key1', latex: 'x' }], [{ name: 'key2', latex: 'y' }], [{ name: 'key3', latex: 'z' }], [], []];
  }),
  normalizeAdditionalKeys: jest.fn((keys) => keys || []),
}));

jest.mock('../keys/utils', () => ({
  extendKeySet: jest.fn((base, additional) => {
    return [...base, ...(additional || [])];
  }),
}));

describe('HorizontalKeypad', () => {
  const { keysForGrade, normalizeAdditionalKeys } = require('../keys/grades');
  const { extendKeySet } = require('../keys/utils');

  const defaultProps = {
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the Keypad component', () => {
      render(<HorizontalKeypad {...defaultProps} />);
      expect(screen.getByTestId('keypad')).toBeInTheDocument();
      expect(screen.getByText('Keypad Mock')).toBeInTheDocument();
    });

    it('should render with default mode (scientific)', () => {
      render(<HorizontalKeypad {...defaultProps} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-mode', 'scientific');
    });

    it('should render with custom mode as string', () => {
      render(<HorizontalKeypad {...defaultProps} mode="geometry" />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-mode', 'geometry');
    });

    it('should render with numeric mode', () => {
      render(<HorizontalKeypad {...defaultProps} mode={6} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-mode', '6');
    });

    it('should render with custom className', () => {
      render(<HorizontalKeypad {...defaultProps} className="custom-keypad" />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-class', 'custom-keypad');
    });
  });

  describe('props forwarding to Keypad', () => {
    it('should forward controlledKeypadMode prop', () => {
      render(<HorizontalKeypad {...defaultProps} controlledKeypadMode={true} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-controlled-mode', 'true');
    });

    it('should forward onFocus prop', () => {
      const onFocus = jest.fn();
      render(<HorizontalKeypad {...defaultProps} onFocus={onFocus} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-has-focus', 'true');
    });

    it('should forward noDecimal prop (default false)', () => {
      render(<HorizontalKeypad {...defaultProps} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-no-decimal', 'false');
    });

    it('should forward noDecimal prop when true', () => {
      render(<HorizontalKeypad {...defaultProps} noDecimal={true} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-no-decimal', 'true');
    });

    it('should forward layoutForKeyPad prop', () => {
      const layout = { type: 'custom' };
      render(<HorizontalKeypad {...defaultProps} layoutForKeyPad={layout} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-has-layout', 'true');
    });

    it('should forward setKeypadInteraction prop', () => {
      const setKeypadInteraction = jest.fn();
      render(<HorizontalKeypad {...defaultProps} setKeypadInteraction={setKeypadInteraction} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-has-interaction', 'true');
    });

    it('should forward all props together', () => {
      const allProps = {
        onClick: jest.fn(),
        onFocus: jest.fn(),
        className: 'test-class',
        controlledKeypadMode: true,
        mode: 'advanced',
        noDecimal: true,
        layoutForKeyPad: { type: 'test' },
        setKeypadInteraction: jest.fn(),
      };

      render(<HorizontalKeypad {...allProps} />);
      const keypad = screen.getByTestId('keypad');

      expect(keypad).toHaveAttribute('data-class', 'test-class');
      expect(keypad).toHaveAttribute('data-controlled-mode', 'true');
      expect(keypad).toHaveAttribute('data-has-focus', 'true');
      expect(keypad).toHaveAttribute('data-no-decimal', 'true');
      expect(keypad).toHaveAttribute('data-has-layout', 'true');
      expect(keypad).toHaveAttribute('data-mode', 'advanced');
      expect(keypad).toHaveAttribute('data-has-interaction', 'true');
    });
  });

  describe('key processing', () => {
    it('should call keysForGrade with mode', () => {
      render(<HorizontalKeypad {...defaultProps} mode="scientific" />);
      expect(keysForGrade).toHaveBeenCalledWith('scientific');
    });

    it('should call keysForGrade with numeric mode', () => {
      render(<HorizontalKeypad {...defaultProps} mode={8} />);
      expect(keysForGrade).toHaveBeenCalledWith(8);
    });

    it('should normalize additional keys', () => {
      const additionalKeys = [{ name: 'custom', latex: 'c' }];
      render(<HorizontalKeypad {...defaultProps} additionalKeys={additionalKeys} />);
      expect(normalizeAdditionalKeys).toHaveBeenCalledWith(additionalKeys);
    });

    it('should normalize empty additional keys (default)', () => {
      render(<HorizontalKeypad {...defaultProps} />);
      expect(normalizeAdditionalKeys).toHaveBeenCalledWith([]);
    });

    it('should extend key set with additional keys', () => {
      const additionalKeys = [{ name: 'custom', latex: 'c' }];
      render(<HorizontalKeypad {...defaultProps} additionalKeys={additionalKeys} />);

      expect(extendKeySet).toHaveBeenCalled();
      const calls = extendKeySet.mock.calls[0];
      expect(calls).toHaveLength(2);
    });
  });

  describe('keypadPress callback', () => {
    it('should call onClick with transformed command data', () => {
      const onClick = jest.fn();
      const { container } = render(<HorizontalKeypad onClick={onClick} />);

      const keypad = screen.getByTestId('keypad');
      keypad.click();

      expect(onClick).toHaveBeenCalledWith({
        value: 'test',
        type: 'command',
      });
    });

    it('should transform command data correctly', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      component.keypadPress({ command: 'sqrt' });

      expect(onClick).toHaveBeenCalledWith({
        value: 'sqrt',
        type: 'command',
      });
    });

    it('should transform write data correctly', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      component.keypadPress({ write: 'x^2' });

      expect(onClick).toHaveBeenCalledWith({
        value: 'x^2',
      });
    });

    it('should transform keystroke data correctly', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      component.keypadPress({ keystroke: 'Left' });

      expect(onClick).toHaveBeenCalledWith({
        type: 'cursor',
        value: 'Left',
      });
    });

    it('should handle data with only command', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      component.keypadPress({ command: 'backspace' });

      expect(onClick).toHaveBeenCalledWith({
        value: 'backspace',
        type: 'command',
      });
    });

    it('should prioritize command over write', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      component.keypadPress({ command: 'cmd', write: 'w' });

      expect(onClick).toHaveBeenCalledWith({
        value: 'cmd',
        type: 'command',
      });
    });

    it('should prioritize write over keystroke', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      component.keypadPress({ write: 'w', keystroke: 'k' });

      expect(onClick).toHaveBeenCalledWith({
        value: 'w',
      });
    });
  });

  describe('toOldModel transformation', () => {
    it('should transform different data types correctly', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      // command
      component.keypadPress({ command: 'frac' });
      expect(onClick).toHaveBeenLastCalledWith({ value: 'frac', type: 'command' });

      // write
      component.keypadPress({ write: 'pi' });
      expect(onClick).toHaveBeenLastCalledWith({ value: 'pi' });

      // keystroke
      component.keypadPress({ keystroke: 'Right' });
      expect(onClick).toHaveBeenLastCalledWith({ type: 'cursor', value: 'Right' });
    });
  });

  describe('additional keys handling', () => {
    it('should handle multiple additional keys', () => {
      const additionalKeys = [
        { name: 'alpha', latex: '\\alpha' },
        { name: 'beta', latex: '\\beta' },
        { name: 'gamma', latex: '\\gamma' },
      ];

      render(<HorizontalKeypad {...defaultProps} additionalKeys={additionalKeys} />);

      expect(normalizeAdditionalKeys).toHaveBeenCalledWith(additionalKeys);
      expect(extendKeySet).toHaveBeenCalled();
    });

    it('should handle empty additional keys array', () => {
      render(<HorizontalKeypad {...defaultProps} additionalKeys={[]} />);

      expect(normalizeAdditionalKeys).toHaveBeenCalledWith([]);
    });

    it('should use default empty array for additional keys', () => {
      render(<HorizontalKeypad {...defaultProps} />);

      expect(normalizeAdditionalKeys).toHaveBeenCalledWith([]);
    });
  });

  describe('re-rendering', () => {
    it('should update when mode changes', () => {
      const { rerender } = render(<HorizontalKeypad {...defaultProps} mode="scientific" />);

      expect(keysForGrade).toHaveBeenCalledWith('scientific');

      rerender(<HorizontalKeypad {...defaultProps} mode="geometry" />);

      expect(keysForGrade).toHaveBeenCalledWith('geometry');
    });

    it('should update when additional keys change', () => {
      const keys1 = [{ name: 'key1', latex: 'k1' }];
      const keys2 = [{ name: 'key2', latex: 'k2' }];

      const { rerender } = render(<HorizontalKeypad {...defaultProps} additionalKeys={keys1} />);

      expect(normalizeAdditionalKeys).toHaveBeenCalledWith(keys1);

      rerender(<HorizontalKeypad {...defaultProps} additionalKeys={keys2} />);

      expect(normalizeAdditionalKeys).toHaveBeenCalledWith(keys2);
    });

    it('should update when onClick changes', () => {
      const onClick1 = jest.fn();
      const onClick2 = jest.fn();

      const { rerender } = render(<HorizontalKeypad onClick={onClick1} />);

      rerender(<HorizontalKeypad onClick={onClick2} />);

      expect(screen.getByTestId('keypad')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined mode (uses default)', () => {
      render(<HorizontalKeypad {...defaultProps} mode={undefined} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-mode', 'scientific');
    });

    it('should handle null additional keys', () => {
      render(<HorizontalKeypad {...defaultProps} additionalKeys={null} />);
      expect(normalizeAdditionalKeys).toHaveBeenCalledWith(null);
    });

    it('should handle mode as 0', () => {
      render(<HorizontalKeypad {...defaultProps} mode={0} />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-mode', '0');
      expect(keysForGrade).toHaveBeenCalledWith(0);
    });

    it('should handle empty string mode', () => {
      render(<HorizontalKeypad {...defaultProps} mode="" />);
      const keypad = screen.getByTestId('keypad');
      expect(keypad).toHaveAttribute('data-mode', '');
    });

    it('should handle keypadPress with empty object', () => {
      const onClick = jest.fn();
      const component = new HorizontalKeypad({ onClick });

      component.keypadPress({});

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('prop types validation', () => {
    const originalError = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });
    afterAll(() => {
      console.error = originalError;
    });

    it('should accept valid string mode', () => {
      expect(() => {
        render(<HorizontalKeypad {...defaultProps} mode="scientific" />);
      }).not.toThrow();
    });

    it('should accept valid number mode', () => {
      expect(() => {
        render(<HorizontalKeypad {...defaultProps} mode={6} />);
      }).not.toThrow();
    });

    it('should accept boolean controlledKeypadMode', () => {
      expect(() => {
        render(<HorizontalKeypad {...defaultProps} controlledKeypadMode={true} />);
      }).not.toThrow();
    });

    it('should accept object layoutForKeyPad', () => {
      expect(() => {
        render(<HorizontalKeypad {...defaultProps} layoutForKeyPad={{}} />);
      }).not.toThrow();
    });

    it('should accept function props', () => {
      expect(() => {
        render(<HorizontalKeypad onClick={jest.fn()} onFocus={jest.fn()} setKeypadInteraction={jest.fn()} />);
      }).not.toThrow();
    });

    it('should accept array additionalKeys', () => {
      expect(() => {
        render(<HorizontalKeypad {...defaultProps} additionalKeys={[]} />);
      }).not.toThrow();
    });
  });

  describe('component lifecycle', () => {
    it('should render correctly on mount', () => {
      const { container } = render(<HorizontalKeypad {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should clean up properly on unmount', () => {
      const { unmount } = render(<HorizontalKeypad {...defaultProps} />);
      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple renders', () => {
      const { rerender } = render(<HorizontalKeypad {...defaultProps} />);

      rerender(<HorizontalKeypad {...defaultProps} mode="geometry" />);
      rerender(<HorizontalKeypad {...defaultProps} mode="scientific" />);
      rerender(<HorizontalKeypad {...defaultProps} mode="statistics" />);

      expect(screen.getByTestId('keypad')).toBeInTheDocument();
    });
  });
});
