const MathPlugin = {};

MathPlugin.ROUND_BRACKETS = 'round_brackets';
MathPlugin.SQUARE_BRACKETS = 'square_brackets';
MathPlugin.DOLLAR = 'dollar';
MathPlugin.DOUBLE_DOLLAR = 'double_dollar';

const PAIRS = {
  [MathPlugin.ROUND_BRACKETS]: ['\\(', '\\)'],
  [MathPlugin.SQUARE_BRACKETS]: ['\\[', '\\]'],
  [MathPlugin.DOLLAR]: ['$', '$'],
  [MathPlugin.DOUBLE_DOLLAR]: ['$$', '$$']
};

export const wrapMath = (content, wrapType) => {
  if (wrapType === MathPlugin.SQUARE_BRACKETS) {
    console.warn('\\[...\\] is not supported yet'); // eslint-disable-line
    wrapType = MathPlugin.ROUND_BRACKETS;
  }
  if (wrapType === MathPlugin.DOUBLE_DOLLAR) {
    console.warn('$$...$$ is not supported yet'); // eslint-disable-line
    wrapType = MathPlugin.DOLLAR;
  }

  const [start, end] = PAIRS[wrapType] || PAIRS[MathPlugin.ROUND_BRACKETS];
  return `${start}${content}${end}`;
};

export const unWrapMath = content => {
  const displayStyleIndex = content.indexOf('\\displaystyle');
  if (displayStyleIndex !== -1) {
    console.warn('\\displaystyle is not supported - removing'); // eslint-disable-line
    content = content.replace('\\displaystyle', '').trim();
  }

  if (content.startsWith('$$') && content.endsWith('$$')) {
    console.warn('$$ syntax is not yet supported'); // eslint-disable-line
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: MathPlugin.DOLLAR
    };
  }
  if (content.startsWith('$') && content.endsWith('$')) {
    return {
      unwrapped: content.substring(1, content.length - 1),
      wrapType: MathPlugin.DOLLAR
    };
  }

  if (content.startsWith('\\[') && content.endsWith('\\]')) {
    console.warn('\\[..\\] syntax is not yet supported'); // eslint-disable-line
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: MathPlugin.ROUND_BRACKETS
    };
  }

  if (content.startsWith('\\(') && content.endsWith('\\)')) {
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: MathPlugin.ROUND_BRACKETS
    };
  }

  return {
    unwrapped: content,
    wrapType: MathPlugin.ROUND_BRACKETS
  };
};