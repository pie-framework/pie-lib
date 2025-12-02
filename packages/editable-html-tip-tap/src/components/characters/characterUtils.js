export const spanishConfig = {
  characters: [
    ['á', 'é', 'í', 'ó', 'ú'],
    ['Á', 'É', 'Í', 'Ó', 'Ú'],
    ['—', '«', '»', 'ñ', 'ü'],
    ['-', '¿', '¡', 'Ñ', 'Ü'],
  ],
};

export const specialConfig = {
  hasPreview: true,
  characters: [
    [
      {
        unicode: 'U+00A2',
        description: 'CENT SIGN',
        write: '¢',
        label: '¢',
      },
      {
        unicode: 'U+00BF',
        description: 'INVERTED QUESTION MARK',
        write: '¿',
        label: '¿',
      },
      {
        unicode: 'U+00B4',
        description: 'ACUTE ACCENT',
        write: '´',
        label: '´',
        extraProps: { style: { gridRow: 'span 2' } },
      },
      {
        unicode: 'U+00E1',
        description: 'LATIN SMALL LETTER A WITH ACUTE',
        write: 'á',
        label: 'á',
      },
      {
        unicode: 'U+00E9',
        description: 'LATIN SMALL LETTER E WITH ACUTE',
        write: 'é',
        label: 'é',
      },
      {
        unicode: 'U+00ED',
        description: 'LATIN SMALL LETTER I WITH ACUTE',
        write: 'í',
        label: 'í',
      },
      {
        unicode: 'U+00F3',
        description: 'LATIN SMALL LETTER O WITH ACUTE',
        write: 'ó',
        label: 'ó',
      },
      {
        unicode: 'U+00FA',
        description: 'LATIN SMALL LETTER U WITH ACUTE',
        write: 'ú',
        label: 'ú',
      },
      {
        unicode: 'U+00F1',
        description: 'LATIN SMALL LETTER N WITH TILDE',
        write: 'ñ',
        label: 'ñ',
      },
    ],
    [
      {
        unicode: 'U+20AC',
        description: 'EURO SIGN',
        write: '€',
        label: '€',
      },
      {
        unicode: 'U+00A1',
        description: 'INVERTED EXCLAMATION MARK',
        write: '¡',
        label: '¡',
      },
      {
        unicode: 'U+00C1',
        description: 'LATIN CAPITAL LETTER A WITH ACUTE',
        write: 'Á',
        label: 'Á',
      },
      {
        unicode: 'U+00C9',
        description: 'LATIN CAPITAL LETTER E WITH ACUTE',
        write: 'É',
        label: 'É',
      },
      {
        unicode: 'U+00CD',
        description: 'LATIN CAPITAL LETTER I WITH ACUTE',
        write: 'Í',
        label: 'Í',
      },
      {
        unicode: 'U+00D3',
        description: 'LATIN CAPITAL LETTER O WITH ACUTE',
        write: 'Ó',
        label: 'Ó',
      },
      {
        unicode: 'U+00DA',
        description: 'LATIN CAPITAL LETTER U WITH ACUTE',
        write: 'Ú',
        label: 'Ú',
      },
      {
        unicode: 'U+00D1',
        description: 'LATIN CAPITAL LETTER N WITH TILDE',
        write: 'Ñ',
        label: 'Ñ',
      },
    ],
    // remaining rows kept identical to original utils.js...
  ],
};

export const characterIcons = {
  spanish: 'ñ',
  special: '€',
};
