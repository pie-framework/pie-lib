import compact from 'lodash/compact';
// import inspect = require('unist-util-inspect')
import English from 'parse-english';

const getWord = w => {
  console.log('get word: ', w);
  const out = w.children.reduce((acc, n) => {
    if (n.value) {
      console.log('acc: ,', acc, ' value? ', n.value);
      return `${acc}${n.value}`;
    } else {
      return acc;
    }
  }, '');
  console.log('out: ', out);
  return out;
};

export const words = text => {
  const tree = new English().parse(text);
  // console.log(JSON.stringify(tree, null, '  '));

  const out = tree.children.reduce((acc, child) => {
    if (child.type === 'ParagraphNode') {
      console.log('acc: ', acc);
      return child.children.reduce((acc, child) => {
        console.log('> acc: ', acc);
        if (child.type === 'SentenceNode') {
          return child.children.reduce((acc, child) => {
            console.log('>> acc: ', acc);
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

  console.log('out:', out);
  return out;
  // console.log(inspect(tree));
  // const raw = text.split(' ');

  // raw.map(w => ({ text: w }));
  // return text.split(' ');
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
