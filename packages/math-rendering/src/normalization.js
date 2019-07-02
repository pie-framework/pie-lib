export const BracketTypes = {};

BracketTypes.ROUND_BRACKETS = 'round_brackets';
BracketTypes.SQUARE_BRACKETS = 'square_brackets';
BracketTypes.DOLLAR = 'dollar';
BracketTypes.DOUBLE_DOLLAR = 'double_dollar';

const PAIRS = {
  [BracketTypes.ROUND_BRACKETS]: ['\\(', '\\)'],
  [BracketTypes.SQUARE_BRACKETS]: ['\\[', '\\]'],
  [BracketTypes.DOLLAR]: ['$', '$'],
  [BracketTypes.DOUBLE_DOLLAR]: ['$$', '$$']
};

export const wrapMath = (content, wrapType) => {
  if (wrapType === BracketTypes.SQUARE_BRACKETS) {
    console.warn('\\[...\\] is not supported yet'); // eslint-disable-line
    wrapType = BracketTypes.ROUND_BRACKETS;
  }
  if (wrapType === BracketTypes.DOUBLE_DOLLAR) {
    console.warn('$$...$$ is not supported yet'); // eslint-disable-line
    wrapType = BracketTypes.DOLLAR;
  }

  const [start, end] = PAIRS[wrapType] || PAIRS[BracketTypes.ROUND_BRACKETS];
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
      wrapType: BracketTypes.DOLLAR
    };
  }
  if (content.startsWith('$') && content.endsWith('$')) {
    return {
      unwrapped: content.substring(1, content.length - 1),
      wrapType: BracketTypes.DOLLAR
    };
  }

  if (content.startsWith('\\[') && content.endsWith('\\]')) {
    console.warn('\\[..\\] syntax is not yet supported'); // eslint-disable-line
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: BracketTypes.ROUND_BRACKETS
    };
  }

  if (content.startsWith('\\(') && content.endsWith('\\)')) {
    return {
      unwrapped: content.substring(2, content.length - 2),
      wrapType: BracketTypes.ROUND_BRACKETS
    };
  }

  return {
    unwrapped: content,
    wrapType: BracketTypes.ROUND_BRACKETS
  };
};
