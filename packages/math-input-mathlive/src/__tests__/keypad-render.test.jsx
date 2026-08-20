import React from 'react';
import { render } from '@testing-library/react';

import KeyPad, { LatexLabel } from '../keypad';

/**
 * Keypad behaviour that is new in this package: labels are static markup from
 * convertLatexToMarkup (the MathQuill version created a live StaticMath per
 * button), with a raw-latex fallback when the engine is unavailable.
 */
describe('LatexLabel', () => {
  it('falls back to raw latex when MathLive is unavailable', () => {
    // jsdom cannot load MathLive, so latexToMarkup returns '' - the button must
    // still show something rather than render blank.
    const { container } = render(<LatexLabel latex={'\\pi'} />);

    expect(container.textContent).toContain('\\pi');
  });

  it('re-renders when the latex prop changes', () => {
    const { container, rerender } = render(<LatexLabel latex={'\\pi'} />);

    rerender(<LatexLabel latex={'\\theta'} />);

    expect(container.textContent).toContain('\\theta');
  });

  it('does not warn more than once about a missing engine', async () => {
    LatexLabel.warned = false;

    const a = new LatexLabel({ latex: '\\pi' });
    const b = new LatexLabel({ latex: '\\theta' });

    a.state = { markup: '' };
    b.state = { markup: '' };
    a.setState = () => {};
    b.setState = () => {};

    await a.componentDidMount();
    await b.componentDidMount();

    expect(LatexLabel.warned).toBe(true);
  });
});

describe('KeyPad', () => {
  const key = (over = {}) => ({ name: 'x', label: 'x', write: 'x', category: 'vars', ...over });

  it('renders a button per key', () => {
    const { container } = render(<KeyPad onPress={() => {}} baseSet={[[key(), key({ name: 'y', label: 'y' })]]} />);

    expect(container.querySelectorAll('button').length).toBe(2);
  });

  it('calls onPress with the whole key definition', () => {
    const onPress = jest.fn();
    const k = key();
    const { container } = render(<KeyPad onPress={onPress} baseSet={[[k]]} />);

    container.querySelector('button').click();

    expect(onPress).toHaveBeenCalledWith(k);
  });

  it('renders a latex key through LatexLabel', () => {
    const { container } = render(<KeyPad onPress={() => {}} baseSet={[[{ name: 'pi', latex: '\\pi' }]]} />);

    expect(container.textContent).toContain('\\pi');
  });

  it('disables the decimal separators when noDecimal is set', () => {
    const dot = key({ name: '.', label: '.', write: '.' });
    const comma = key({ name: ',', label: ',', write: ',' });
    const { container } = render(<KeyPad onPress={() => {}} noDecimal baseSet={[[dot, comma]]} />);

    const disabled = Array.from(container.querySelectorAll('button')).filter((b) => b.disabled);

    expect(disabled.length).toBe(2);
  });

  it('leaves the separators enabled otherwise', () => {
    const dot = key({ name: '.', label: '.', write: '.' });
    const { container } = render(<KeyPad onPress={() => {}} baseSet={[[dot]]} />);

    expect(container.querySelector('button').disabled).toBe(false);
  });

  it('renders a placeholder for empty grid slots', () => {
    expect(() => render(<KeyPad onPress={() => {}} baseSet={[[null]]} />)).not.toThrow();
  });

  it('notifies setKeypadInteraction on pointer interaction', () => {
    const setKeypadInteraction = jest.fn();
    const { container } = render(
      <KeyPad onPress={() => {}} setKeypadInteraction={setKeypadInteraction} baseSet={[[key()]]} />,
    );

    container.firstChild.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(setKeypadInteraction).toHaveBeenCalledWith(true);
  });

  it('uses the mode as a class so mode-specific styling applies', () => {
    const { container } = render(<KeyPad onPress={() => {}} mode="language" baseSet={[[key()]]} />);

    expect(container.firstChild.className).toContain('language');
  });

  it('drops the base set for the modes that supply their own keys', () => {
    const { container } = render(
      <KeyPad onPress={() => {}} mode="language" baseSet={[[key(), key()]]} additionalKeys={[[key()]]} />,
    );

    // base set ignored, only the additional key renders
    expect(container.querySelectorAll('button').length).toBe(1);
  });

  it('unmounts without throwing', () => {
    const { unmount } = render(<KeyPad onPress={() => {}} controlledKeypadMode baseSet={[[key()]]} />);

    expect(() => unmount()).not.toThrow();
  });
});
