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

const getParagraph = p => g('', p);

const getSentence = s => g('', s);

const getWord = w => g('', w);

export const paragraphs = text => {
  const tree = new English().parse(text);

  const out = tree.children.reduce((acc, child) => {
    if (child.type === 'ParagraphNode') {
      const paragraph = {
        text: getParagraph(child),
        start: child.position.start.offset,
        end: child.position.end.offset
      };

      return acc.concat([paragraph]);
    } else {
      return acc;
    }
  }, []);

  return out;
};

export const sentences = text => {
  // Sentences that end with one-character-word (e.g.: "This is sentence 1.") are not parsed properly.
  // Sentences are parsed properly however if there is a white space if front of the "." (e.g.: "This is sentence 1 .")

  // To fix this, we insert a special group of characters in front of each "."
  // that belongs to a sentence where the last word is a one-character-word
  // and we remove the special group after that
  // The special group that is inserted is "@_# "

  // e.g.: "Sentence 1. Sentence 2. Sentence 3."
  // I. gets transformed into: "Sentence 1@_# . Sentence 2@_# . Sentence 3@_# ."
  // II.
  // Sentence 1@_# .
  //    1. start = 0 - 0 => token = { text: 'Sentence 1', start: 0, end: 11 }
  //    2. eliminatedCharacters: 4, tokens: [{ text: 'Sentence 1', start: 0, end: 11 }]
  // Sentence 2@_# .
  //    1. start = 16 - 4 => token = { text: 'Sentence 2', start: 12, end: 23 }
  //    2. eliminatedCharacters: 8, tokens: [{ text: 'Sentence 1', start: 0, end: 11 }, { text: 'Sentence 2', start: 12, end: 23 }]
  // Sentence 3@_# .
  //    1. start = 32 - 8 => token = { text: 'Sentence 3', start: 24, end: 35 }
  //    2. eliminatedCharacters: 12, tokens: [{ text: 'Sentence 1', start: 0, end: 11 }, { text: 'Sentence 2', start: 12, end: 23 }, { text: 'Sentence 3', start: 24, end: 35 }]

  // I. add "@_# " before ".", where needed
  const prepareText = (text || '').replace(/( +.{1})\./g, '$1@_# .');

  // parse sentences
  const tree = new English().parse(prepareText);

  // we will accumulate not only the tokens but also the number of characters (belonging to the Special Group) that were removed
  const initialAccumulator = {
    tokens: [],
    eliminatedCharacters: 0
  };

  const out = tree.children.reduce((acc, child) => {
    if (child.type === 'ParagraphNode') {
      return child.children.reduce((acc, child) => {
        // II for each sentence
        if (child.type === 'SentenceNode') {
          // get the current sentence value (value that contains the Special Groups: "@_# ")
          const sentenceText = getSentence(child);
          // remove all the Special Groups "@_# "
          const parsedSentence = sentenceText.replace(/( +.{1})@_# \./g, '$1.');

          // 1. we have to take the current offset - the number of previously removed "@_# "
          const start = child.position.start.offset - acc.eliminatedCharacters;

          const sentence = {
            text: parsedSentence,
            start,
            end: start + parsedSentence.length
          };

          // how many special characters we eliminated in this sentence
          // usually, we should not have more than one Special Group per sentence, but just to make sure:
          const eliminatedCharactersInThisSentence = sentenceText.length - parsedSentence.length;

          // 2. increase number of eliminated characters
          return {
            tokens: acc.tokens.concat([sentence]),
            eliminatedCharacters: acc.eliminatedCharacters + eliminatedCharactersInThisSentence
          };
        } else {
          return acc;
        }
      }, acc);
    } else {
      return acc;
    }
  }, initialAccumulator);

  return out.tokens;
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
    return this.results.filter(r => r.type === 'within-selection').map(t => t.token);
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
          `sort does not support intersecting tokens. a: ${a.start}-${a.end}, b: ${b.start}-${b.end}`
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
      } else if (lastIndex < t.start) {
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
        lastIndex: tokens.length ? tokens[tokens.length - 1].end : lastIndex,
        result: acc.result.concat(tokens)
      };
    },
    { result: [], lastIndex: 0 }
  );

  return out.result;
};
