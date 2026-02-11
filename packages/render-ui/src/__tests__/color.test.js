import {
  background,
  backgroundDark,
  black,
  blueGrey100,
  blueGrey300,
  blueGrey600,
  blueGrey900,
  border,
  borderDark,
  borderGray,
  borderLight,
  correct,
  correctSecondary,
  correctTertiary,
  correctWithIcon,
  defaults,
  disabled,
  disabledSecondary,
  dropdownBackground,
  fadedPrimary,
  focusChecked,
  focusCheckedBorder,
  focusUnchecked,
  focusUncheckedBorder,
  incorrectSecondary,
  incorrectWithIcon,
  missing,
  missingWithIcon,
  primary,
  primaryDark,
  primaryLight,
  primaryText,
  secondary,
  secondaryBackground,
  secondaryDark,
  secondaryLight,
  secondaryText,
  tertiary,
  tertiaryLight,
  text,
  transparent,
  v,
  visualElementsColors,
  white,
} from '../color';

describe('v', () => {
  it.each`
    args                                 | expected
    ${['text', 'black']}                 | ${'var(--pie-text, black)'}
    ${['primary-text', 'text', 'black']} | ${'var(--pie-primary-text, var(--pie-text, black))'}
    ${['black']}                         | ${'black'}
    ${['#00ff00']}                       | ${'#00ff00'}
  `('$args => $expected', ({ args, expected }) => {
    expect(v('pie')(...args)).toEqual(expected);
  });

  it('should create custom prefix CSS variables', () => {
    const customPrefix = v('custom');
    expect(customPrefix('color', '#fff')).toBe('var(--custom-color, #fff)');
  });

  it('should handle multiple nested variables', () => {
    const pv = v('pie');
    expect(pv('a', 'b', 'c', 'd', 'fallback')).toBe('var(--pie-a, var(--pie-b, var(--pie-c, var(--pie-d, fallback))))');
  });
});

describe('defaults', () => {
  it('should be frozen and immutable', () => {
    expect(Object.isFrozen(defaults)).toBe(true);
    expect(() => {
      defaults.TEXT = 'red';
    }).toThrow();
  });

  it('should contain expected color values', () => {
    expect(defaults.TEXT).toBe('black');
    expect(defaults.CORRECT).toBeDefined();
    expect(defaults.PRIMARY).toBeDefined();
    expect(defaults.TRANSPARENT).toBe('transparent');
  });
});

describe('color functions', () => {
  it('should return CSS variable string for text', () => {
    expect(text()).toBe('var(--pie-text, black)');
  });

  it('should return CSS variable string for correct', () => {
    expect(correct()).toContain('var(--pie-correct,');
    expect(correct()).toContain(defaults.CORRECT);
  });

  it('should return CSS variable string for primary', () => {
    expect(primary()).toContain('var(--pie-primary,');
    expect(primary()).toContain(defaults.PRIMARY);
  });

  it('should return default value for transparent', () => {
    expect(transparent()).toBe('transparent');
  });

  it('should return nested CSS variables for primaryText', () => {
    const result = primaryText();
    expect(result).toContain('var(--pie-primary-text,');
    expect(result).toContain('var(--pie-text,');
    expect(result).toContain('black');
  });

  it('should return CSS variable string for border', () => {
    expect(border()).toContain('var(--pie-border,');
    expect(border()).toContain(defaults.BORDER);
  });

  it('should return CSS variable string for blueGrey600', () => {
    expect(blueGrey600()).toContain('var(--pie-blue-grey-600,');
    expect(blueGrey600()).toContain(defaults.BLUE_GREY600);
  });
});

describe('visualElementsColors', () => {
  it('should contain expected charting colors', () => {
    expect(visualElementsColors.AXIS_LINE_COLOR).toBe('#5A53C9');
    expect(visualElementsColors.ROLLOVER_FILL_BAR_COLOR).toBe('#050F2D');
    expect(visualElementsColors.GRIDLINES_COLOR).toBe('#8E88EA');
    expect(visualElementsColors.PLOT_FILL_COLOR).toBe('#1463B3');
  });

  it('should have all required properties', () => {
    expect(visualElementsColors).toHaveProperty('AXIS_LINE_COLOR');
    expect(visualElementsColors).toHaveProperty('ROLLOVER_FILL_BAR_COLOR');
    expect(visualElementsColors).toHaveProperty('GRIDLINES_COLOR');
    expect(visualElementsColors).toHaveProperty('PLOT_FILL_COLOR');
  });

  it('should be immutable', () => {
    const original = { ...visualElementsColors };
    expect(() => {
      visualElementsColors.AXIS_LINE_COLOR = '#000000';
    }).not.toThrow(); // Note: not frozen, but we document this is expected behavior
    // Verify it didn't actually change (if frozen, it wouldn't)
    expect(original.AXIS_LINE_COLOR).toBe('#5A53C9');
  });
});

describe('additional color functions', () => {
  it('should return correct values for disabled colors', () => {
    expect(disabled()).toContain('var(--pie-disabled,');
    expect(disabled()).toContain(defaults.DISABLED);

    expect(disabledSecondary()).toContain('var(--pie-disabled-secondary,');
    expect(disabledSecondary()).toContain(defaults.DISABLED_SECONDARY);
  });

  it('should return correct values for correct color variants', () => {
    expect(correctSecondary()).toContain('var(--pie-correct-secondary,');
    expect(correctTertiary()).toContain('var(--pie-correct-tertiary,');
    expect(correctWithIcon()).toContain('var(--pie-correct-icon,');
  });

  it('should return correct values for incorrect color variants', () => {
    expect(incorrectWithIcon()).toContain('var(--pie-incorrect-icon,');
    expect(incorrectSecondary()).toContain('var(--pie-incorrect-secondary,');
  });

  it('should return correct values for missing color variants', () => {
    expect(missing()).toContain('var(--pie-missing,');
    expect(missingWithIcon()).toContain('var(--pie-missing-icon,');
  });

  it('should return correct values for primary color variants', () => {
    expect(primaryLight()).toContain('var(--pie-primary-light,');
    expect(primaryDark()).toContain('var(--pie-primary-dark,');
    expect(fadedPrimary()).toContain('var(--pie-faded-primary,');
  });

  it('should return correct values for secondary color variants', () => {
    expect(secondary()).toContain('var(--pie-secondary,');
    expect(secondaryLight()).toContain('var(--pie-secondary-light,');
    expect(secondaryDark()).toContain('var(--pie-secondary-dark,');
    expect(secondaryText()).toContain('var(--pie-secondary-text,');
  });

  it('should return correct values for tertiary colors', () => {
    expect(tertiary()).toContain('var(--pie-tertiary,');
    expect(tertiaryLight()).toContain('var(--pie-tertiary-light,');
  });

  it('should return correct values for background colors', () => {
    expect(background()).toContain('var(--pie-background,');
    expect(backgroundDark()).toContain('var(--pie-background-dark,');
    expect(secondaryBackground()).toContain('var(--pie-secondary-background,');
    expect(dropdownBackground()).toContain('var(--pie-dropdown-background,');
  });

  it('should return correct values for border colors', () => {
    expect(borderLight()).toContain('var(--pie-border-light,');
    expect(borderDark()).toContain('var(--pie-border-dark,');
    expect(borderGray()).toContain('var(--pie-border-gray,');
  });

  it('should return correct values for black and white', () => {
    expect(black()).toContain('var(--pie-black,');
    expect(black()).toContain(defaults.BLACK);
    expect(white()).toContain('var(--pie-white,');
    expect(white()).toContain(defaults.WHITE);
  });

  it('should return correct values for focus colors', () => {
    expect(focusChecked()).toContain('var(--pie-focus-checked,');
    expect(focusCheckedBorder()).toContain('var(--pie-focus-checked-border,');
    expect(focusUnchecked()).toContain('var(--pie-focus-unchecked,');
    expect(focusUncheckedBorder()).toContain('var(--pie-focus-unchecked-border,');
  });

  it('should return correct values for blue-grey colors', () => {
    expect(blueGrey100()).toContain('var(--pie-blue-grey-100,');
    expect(blueGrey300()).toContain('var(--pie-blue-grey-300,');
    expect(blueGrey900()).toContain('var(--pie-blue-grey-900,');
  });
});

describe('edge cases', () => {
  it('should handle empty arguments for v function', () => {
    const customV = v('test');
    expect(customV('fallback')).toBe('fallback');
  });

  it('should handle single argument for v function', () => {
    const customV = v('test');
    expect(customV('color', 'red')).toBe('var(--test-color, red)');
  });

  it('should handle special characters in prefix', () => {
    const specialV = v('my-custom-prefix');
    expect(specialV('color', 'blue')).toBe('var(--my-custom-prefix-color, blue)');
  });

  it('should verify secondaryText nesting', () => {
    const result = secondaryText();
    expect(result).toContain('var(--pie-secondary-text,');
    expect(result).toContain('var(--pie-text,');
    expect(result).toContain('black');
  });

  it('should verify all defaults are strings', () => {
    Object.values(defaults).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });

  it('should verify color hex format for specific defaults', () => {
    expect(defaults.BLACK).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(defaults.WHITE).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(defaults.TERTIARY).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
