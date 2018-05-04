import compact from 'lodash/compact';
import English from 'parse-english';

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
