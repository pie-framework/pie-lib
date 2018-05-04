import compact from 'lodash/compact';
import English from 'parse-english';
import clone from 'lodash/clone';

const g = (str, node) => {
  if (node.children) {
    return node.children.reduce(g, str);
  } else if (node.value) {
    return str + node.value;
  } else {
    return str;
  }
};

const getSentence = s => g('', s);

const getWord = w => g('', w);

export const sentences = text => {
  const tree = new English().parse(text);

  // console.log(JSON.stringify(tree.children[0].children, null, '  '));
  const out = tree.children.reduce((acc, child) => {
    if (child.type === 'ParagraphNode') {
      return child.children.reduce((acc, child) => {
        if (child.type === 'SentenceNode') {
          const sentence = {
            text: getSentence(child),
            start: child.position.start.offset,
            end: child.position.end.offset
          };
          return acc.concat([sentence]);
        } else {
          return acc;
        }
      }, acc);
    } else {
      return acc;
    }
  }, []);

  return out;
};
export const words = text => {
  const tree = new English().parse(text);

  const out = tree.children.reduce((acc, child) => {
    if (child.type === 'ParagraphNode') {
      return child.children.reduce((acc, child) => {
        if (child.type === 'SentenceNode') {
          return child.children.reduce((acc, child) => {
            if (child.type === 'WordNode') {
              const node = {
                text: getWord(child),
                start: child.position.start.offset,
                end: child.position.end.offset
              };
              return acc.concat([node]);
            } else {
              return acc;
            }
          }, acc);
        } else {
          return acc;
        }
      }, acc);
    } else {
      return acc;
    }
  }, []);

  return out;
};

class Intersection {
  constructor(results) {
    this.results = results;
  }

  get hasOverlap() {
    return this.results.filter(r => r.type === 'overlap').length > 0;
  }

  get surroundedTokens() {
    return this.results
      .filter(r => r.type === 'within-selection')
      .map(t => t.token);
  }
}
/**
 * get intersection info for the selection in relation to tokens.
 * @param {{start: number, end: number}} selection
 * @param {{start: number, end: number}[]} tokens
 * @return {tokens: [], type: 'overlap|no-overlap|contains'}
 */
export const intersection = (selection, tokens) => {
  const { start, end } = selection;

  const startsWithin = t => start >= t.start && start < t.end;
  const endsWithin = t => end > t.start && end <= t.end;

  const mapped = tokens.map(t => {
    if (start === t.start && end === t.end) {
      return { token: t, type: 'exact-fit' };
    } else if (start <= t.start && end >= t.end) {
      return { token: t, type: 'within-selection' };
    } else if (startsWithin(t) || endsWithin(t)) {
      return { token: t, type: 'overlap' };
    }
  });
  return new Intersection(compact(mapped));
};

export const sort = tokens => {
  if (!Array.isArray(tokens)) {
    return tokens;
  } else {
    const out = clone(tokens);
    out.sort((a, b) => {
      const s = a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
      const e = a.end < b.end ? -1 : a.end > b.end ? 1 : 0;
      if (s === -1 && e !== -1) {
        throw new Error(
          `sort does not support intersecting tokens. a: ${a.start}-${
            a.end
          }, b: ${b.start}-${b.end}`
        );
      }
      return s;
    });
    return out;
  }
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
  const out = sort(tokens).reduce(
    (acc, t, index, outer) => {
      let tokens = [];

      const lastIndex = acc.lastIndex;
      if (t.start === lastIndex) {
        tokens = [
          {
            text: text.substring(lastIndex, t.end),
            start: lastIndex,
            end: t.end,
            predefined: true,
            correct: t.correct
          }
        ];
      } else {
        tokens = [
          {
            text: text.substring(lastIndex, t.start),
            start: lastIndex,
            end: t.start
          },
          {
            text: text.substring(t.start, t.end),
            start: t.start,
            end: t.end,
            predefined: true,
            correct: t.correct
          }
        ];
      }

      if (index === outer.length - 1 && t.end < text.length) {
        const last = {
          text: text.substring(t.end),
          start: t.end,
          end: text.length
        };
        tokens.push(last);
      }

      return {
        lastIndex: tokens[tokens.length - 1].end,
        result: acc.result.concat(tokens)
      };
    },
    { result: [], lastIndex: 0 }
  );

  return out.result;
};
