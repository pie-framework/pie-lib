import compact from 'lodash/compact';
import { sentences } from 'sbd';

export { sentences };

export const words = text => {
  return text.split(' ');
};

export const normalize = (text, tokens) => {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    return [
      {
        text,
        start: 0,
        end: text.length
      }
    ];
  }
  const out = tokens.reduce(
    (acc, t, index) => {
      const { start, end } = t;

      const tokenText = text.substring(start, end);
      const token = { text: tokenText, start, end, predefined: true };
      let normal = null;
      let last = null;

      if (acc.previousToken) {
        const normalTextIndex = acc.previousToken.end;
        const normalText = text.substring(normalTextIndex, start);
        normal = { text: normalText, start: normalTextIndex, end: start };
      }
      if (index === tokens.length - 1) {
        last = {
          text: text.substring(end),
          start: end,
          end: text.length
        };
      }
      return {
        previousToken: t,
        result: acc.result.concat(compact([normal, token, last]))
      };
    },
    { result: [] }
  );

  return out.result;
};
