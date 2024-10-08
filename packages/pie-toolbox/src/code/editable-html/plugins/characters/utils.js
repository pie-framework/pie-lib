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
    [
      {
        unicode: 'U+00A3',
        description: 'POUND SIGN',
        write: '£',
        label: '£',
      },
      {
        unicode: 'U+00AB',
        description: 'LEFT-POINTING DOUBLE ANGLE QUOTATION MARK',
        write: '«',
        label: '«',
      },
      {
        unicode: 'U+005E',
        description: 'CIRCUMFLEX ACCENT',
        write: '^',
        label: '^',
        extraProps: { style: { gridRow: 'span 2' } },
      },
      {
        unicode: 'U+00E2',
        description: 'LATIN SMALL LETTER A WITH CIRCUMFLEX',
        write: 'â',
        label: 'â',
      },
      {
        unicode: 'U+00EA',
        description: 'LATIN SMALL LETTER E WITH CIRCUMFLEX',
        write: 'ê',
        label: 'ê',
      },
      {
        unicode: 'U+00EE',
        description: 'LATIN SMALL LETTER I WITH CIRCUMFLEX',
        write: 'î',
        label: 'î',
      },
      {
        unicode: 'U+00F4',
        description: 'LATIN SMALL LETTER O WITH CIRCUMFLEX',
        write: 'ô',
        label: 'ô',
      },
      {
        unicode: 'U+00FB',
        description: 'LATIN SMALL LETTER U WITH CIRCUMFLEX',
        write: 'û',
        label: 'û',
      },
      {
        unicode: 'U+00E7',
        description: 'LATIN SMALL LETTER C WITH CEDILLA',
        write: 'ç',
        label: 'ç',
      },
    ],
    [
      {
        unicode: 'U+00A5',
        description: 'YEN SIGN',
        write: '¥',
        label: '¥',
      },
      {
        unicode: 'U+00BB',
        description: 'RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK',
        write: '»',
        label: '»',
      },
      {
        unicode: 'U+00C2',
        description: 'LATIN CAPITAL LETTER A WITH CIRCUMFLEX',
        write: 'Â',
        label: 'Â',
      },
      {
        unicode: 'U+00CA',
        description: 'LATIN CAPITAL LETTER E WITH CIRCUMFLEX',
        write: 'Ê',
        label: 'Ê',
      },
      {
        unicode: 'U+00CE',
        description: 'LATIN CAPITAL LETTER I WITH CIRCUMFLEX',
        write: 'Î',
        label: 'Î',
      },
      {
        unicode: 'U+00D4',
        description: 'LATIN CAPITAL LETTER O WITH CIRCUMFLEX',
        write: 'Ô',
        label: 'Ô',
      },
      {
        unicode: 'U+00DB',
        description: 'LATIN CAPITAL LETTER U WITH CIRCUMFLEX',
        write: 'Û',
        label: 'Û',
      },
      {
        unicode: 'U+00C7',
        description: 'LATIN CAPITAL LETTER C WITH CEDILLA',
        write: 'Ç',
        label: 'Ç',
      },
    ],
    [
      {
        unicode: 'U+200A',
        description: 'HAIR SPACE',
        write: String.fromCodePoint('0x200A'),
        label: '&hairsp;',
      },
      {
        unicode: 'U+00A7',
        description: 'SECTION SIGN',
        write: '§',
        label: '§',
      },
      {
        unicode: 'U+00A8',
        description: 'DIAERESIS',
        write: '¨',
        label: '¨',
        extraProps: { style: { gridRow: 'span 2' } },
      },
      {
        unicode: 'U+00E4',
        description: 'LATIN SMALL LETTER A WITH DIAERESIS',
        write: 'ä',
        label: 'ä',
      },
      {
        unicode: 'U+00EB',
        description: 'LATIN SMALL LETTER E WITH DIAERESIS',
        write: 'ë',
        label: 'ë',
      },
      {
        unicode: 'U+00EF',
        description: 'LATIN SMALL LETTER I WITH DIAERESIS',
        write: 'ï',
        label: 'ï',
      },
      {
        unicode: 'U+00F6',
        description: 'LATIN SMALL LETTER O WITH DIAERESIS',
        write: 'ö',
        label: 'ö',
      },
      {
        unicode: 'U+00FC',
        description: 'LATIN SMALL LETTER U WITH DIAERESIS',
        write: 'ü',
        label: 'ü',
      },
      {
        unicode: 'U+00DF',
        description: 'LATIN SMALL LETTER SHARP S',
        write: 'ß',
        label: 'ß',
      },
    ],
    [
      {
        unicode: 'U+2009',
        description: 'THIN SPACE',
        write: String.fromCodePoint('0x2009'),
        label: '&thinsp;',
      },
      {
        unicode: 'U+2026',
        description: 'HORIZONTAL ELLIPSIS',
        write: '…',
        label: '…',
      },
      {
        unicode: 'U+00C4',
        description: 'LATIN CAPITAL LETTER A WITH DIAERESIS',
        write: 'Ä',
        label: 'Ä',
      },
      {
        unicode: 'U+00CB',
        description: 'LATIN CAPITAL LETTER E WITH DIAERESIS',
        write: 'Ë',
        label: 'Ë',
      },
      {
        unicode: 'U+00CF',
        description: 'LATIN CAPITAL LETTER I WITH DIAERESIS',
        write: 'Ï',
        label: 'Ï',
      },
      {
        unicode: 'U+00D6',
        description: 'LATIN CAPITAL LETTER O WITH DIAERESIS',
        write: 'Ö',
        label: 'Ö',
      },
      {
        unicode: 'U+00DC',
        description: 'LATIN CAPITAL LETTER U WITH DIAERESIS',
        write: 'Ü',
        label: 'Ü',
      },
      {
        unicode: 'U+2212',
        description: 'MINUS SIGN',
        write: '−',
        label: '−',
      },
    ],
    [
      {
        unicode: 'U+00A0',
        description: 'NO-BREAK SPACE',
        write: String.fromCodePoint('0x00A0'),
        label: '&nbsp;',
      },
      {
        unicode: 'U+2022',
        description: 'BULLET',
        write: '•',
        label: '•',
      },
      {
        unicode: 'U+0060',
        description: 'GRAVE ACCENT',
        write: '`',
        label: '`',
        extraProps: { style: { gridRow: 'span 2' } },
      },
      {
        unicode: 'U+00E0',
        description: 'LATIN SMALL LETTER A WITH GRAVE',
        write: 'à',
        label: 'à',
      },
      {
        unicode: 'U+00E8',
        description: 'LATIN SMALL LETTER E WITH GRAVE',
        write: 'è',
        label: 'è',
      },
      {
        unicode: 'U+00EC',
        description: 'LATIN SMALL LETTER I WITH GRAVE',
        write: 'ì',
        label: 'ì',
      },
      {
        unicode: 'U+00F2',
        description: 'LATIN SMALL LETTER O WITH GRAVE',
        write: 'ò',
        label: 'ò',
      },
      {
        unicode: 'U+00F9',
        description: 'LATIN SMALL LETTER U WITH GRAVE',
        write: 'ù',
        label: 'ù',
      },
      {
        unicode: 'U+2013',
        description: 'EN DASH',
        write: '–',
        label: '–',
      },
    ],
    [
      {
        unicode: 'U+2003',
        description: 'EM SPACE',
        write: String.fromCodePoint('0x2003'),
        label: '&emsp;',
      },
      {
        unicode: 'U+25E6',
        description: 'WHITE BULLET',
        write: '◦',
        label: '◦',
      },
      {
        unicode: 'U+00C0',
        description: 'LATIN CAPITAL LETTER A WITH GRAVE',
        write: 'À',
        label: 'À',
      },
      {
        unicode: 'U+00C8',
        description: 'LATIN CAPITAL LETTER E WITH GRAVE',
        write: 'È',
        label: 'È',
      },
      {
        unicode: 'U+00CC',
        description: 'LATIN CAPITAL LETTER I WITH GRAVE',
        write: 'Ì',
        label: 'Ì',
      },
      {
        unicode: 'U+00D2',
        description: 'LATIN CAPITAL LETTER O WITH GRAVE',
        write: 'Ò',
        label: 'Ò',
      },
      {
        unicode: 'U+00D9',
        description: 'LATIN CAPITAL LETTER U WITH GRAVE',
        write: 'Ù',
        label: 'Ù',
      },
      {
        unicode: 'U+2014',
        description: 'EM DASH',
        write: '—',
        label: '—',
      },
    ],
  ],
};

export const characterIcons = {
  spanish: 'ñ',
  special: '€',
};
