export default {
  Simple: {
    x: ['x'],
    '0': { eq: ['0.0'], neq: ['1.0', 'x', '3x', '4x'] }
  },
  'Simple expressions': {
    '100': {
      eq: ['100', '50 + 50', '25 * 4', '200 / 2', '20 * 5', '2.5 * 40', '10 * 10'],
      neq: ['0', '50 * 2 + 1', '44 + 57', '44 + 57', '50 * 3']
    }
  },
  Variables: {
    x: {
      eq: ['x', '2x/2', '(x-2) + 100/50']
    },
    '(x + 2)^2': {
      eq: [
        'x^2 + 4x + 4',
        'x^2 + 4(x+1)',
        'x^2 + 8 ((x+1) / 2)',
        '(2 + x)^2',
        'x^2 + 4x + 4',
        'x^2 + 4(x+1)',
        'x^2 + 8 ((x+1) / 2)'
      ],
      neq: ['x^3 + 4x + 4', 'x^2 + 4(x+2)']
    },
    '(2 + x)^2x': ['(x + 2)^2x'],
    'y^(2 x)': ['y^(x+x)']
  },
  Functions: {
    'sqrt(4x)': ['sqrt(2x+2x)'],
    'sqrt(x^2)': ['sqrt(((x+1)^2) - ((x+1)^2) + x^2)']
  },
  'Allow Decimals': {
    '123': ['123.0', '123.00000']
  },
  // 'Disallow Decimals': {
  //   allowDecimals: false,
  //   '123': { neq: ['123.0', '123.00000'] }
  // },
  Trigonometry: {
    'sin(x)': ['sin(x)'],
    'tan(x)': ['tan(x)']
  }
};

export const fullExpressions = {
  Expr: {
    isLatex: true,
    'n=-11': ['n=-10 -1'],
    'V=9\\times18\\times30': [
      'V=9\\times18\\times30',
      'V=30\\times18\\times9',
      'V=15\\times2\\times18\\times9'
      // 'V=14\\times2\\times18\\times9'
    ],
    '\\frac{1}{3}=\\frac{2}{6}': [
      '\\frac{1}{3} = \\frac{4}{12}',
      '\\frac{1}{\\frac{3}{1}} = \\frac{2}{6}',
      '\\frac{10}{\\frac{30}{1}} = \\frac{2}{6}'
    ],
    '2x-9+\\frac{35}{x+3}': [
      '2x - 9 + \\frac{35}{x+3}',
      '\\frac{100}{50}x - 9 + \\frac{7\\times5}{x+3}',
      '\\frac{100}{50}x - 9 + \\frac{35}{x+3}'
    ]
    //TODO: support \\text
    //'\\frac{2}{3}\\ \\text{pounds}': ['\\frac{2}{3}\\ \\text{pounds}'],
    //'270\\ \\text{minutes}' : ['270\\ \\text{minutes}']
  }
};
