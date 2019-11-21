const { create, all, expression } = require('mathjs');
const _ = require('lodash');
/**
 *
 * Notes:
 *
 * 1. Is it possible to do away with math expressions altogether? And just run some transforms on what mathjs creates as the expression tree?
 *
 *
 * todos:
 *
 * 1. math-expressions parsing .. when parts are missing:
 *   - 'nequal' - is missing l + r side .. how to handle?
 *   - '%' no value to percent of ..
 * For the above it looks like learnosity stub in a 0 for it to make sense. we can do something similar, but where do we do it?
 */

// function ConstantNode(value) {
//   if (!(this instanceof ConstantNode)) {
//     throw new SyntaxError('Constructor must be called with the new operator');
//   }

//   if (arguments.length === 2) {
//     // TODO: remove deprecation error some day (created 2018-01-23)
//     throw new SyntaxError(
//       'new ConstantNode(valueStr, valueType) is not supported anymore since math v4.0.0. Use new ConstantNode(value) instead, where value is a non-stringified value.'
//     );
//   }

//   this.value = value;
// }

// // ConstantNode.prototype = new Node();
// ConstantNode.prototype.type = 'ConstantNode';
// ConstantNode.prototype.isConstantNode = true;
const math = create(all);

// const d = math.parse('10 * 0.01');
// console.log('d:', JSON.stringify(d, null, '  '));
// const parser = math.parser();
// const parseOpts = {
//   nodes: {
//     percent: function(args) {
//       return new OperatorNode('*', 'multiply', args.concat([new ConstantNode(10)]));
//       // {
//       //   mathjs: 'OperatorNode',
//       //   op: '*',
//       //   fn: 'multiply',
//       //   implicit: false,
//       //   args: args.concat({ mathjs: 'ConstantNode', value: 0.01 })
//       // };
//     }
//   }
// };
// const t = math.parse('percent(10)', parseOpts);
// // const t = parser.parse('1');
// console.log('t:', JSON.stringify(t, null, '  '));
// console.log('math:', math);

// // create a function
// function addIt(a, b) {
//   return a + b;
// }

// // attach a transform function to the function addIt
// addIt.transform = function(a, b) {
//   console.log('input: a=' + a + ', b=' + b);
//   // we can manipulate input here before executing addIt

//   const res = addIt(a, b);

//   console.log('result: ' + res);
//   // we can manipulate result here before returning

//   return res;
// };

// function percent(a) {
//   return a * 0.01;
// }

// // import the function into math.js
// math.import({
//   addIt: addIt,
//   percent: percent
// });

/** Then multiply operator can have multiple args */
const multipleArgs = () => {
  const one = new expression.node.ConstantNode(1);
  const two = new expression.node.ConstantNode(2);
  const three = new expression.node.ConstantNode(3);

  const m = new expression.node.OperatorNode('*', 'multiply', [one, two, three]);

  const c = m.compile();

  console.log('c:', c.eval());
};

const multiplyNode = (a, b) => new expression.node.OperatorNode('*', 'multiply', [a, b]);
const constantNode = v => new expression.node.ConstantNode(v);

const parse = s => {
  const tree = math.parse(s);
  return tree.transform((node, path, parent) => {
    // console.log('node:', node.name, node.fn); // JSON.stringify(node));
    if (node.name === 'percent') {
      // console.log('FFF');
      return new expression.node.OperatorNode(
        '*',
        'multiply',
        node.args.concat(new expression.node.ConstantNode(0.01))
      );
    }

    /**
     * to mimic the behavior - we convert  a mod into a percent multiplication
     */
    if (node.fn === 'mod') {
      // (10 * 0.01) * a
      // (a * 0.01) * 10
      // args are 10,a
      return multiplyNode(multiplyNode(node.args[0], constantNode(0.01)), node.args[1]);
    }
    return node;
  });
};

const COMMUTATIVE_FNS = ['multiply', 'add', 'equal', 'unequal'];
const isCommutativeOperator = n => n && n.type === 'OperatorNode' && COMMUTATIVE_FNS.includes(n.fn);

const liftArgs = op => node => {
  if (isCommutativeOperator(node) && node.op === op) {
    return _.flatten(node.args.map(liftArgs(op)));
  }
  if (node.type === 'ParenthesisNode') {
    return liftArgs(op)(node.content);
  }
  return [node];
};

const noSymbols = node => {
  const symbols = node.filter(n => {
    return n.isSymbolNode;
  });
  return symbols.length === 0;
};

const sort = n => {
  // console.log('[sort]', n.toString());
  // return math.simplify(n);
  // const simplified = math.simplify(n);

  const node = noSymbols(n) ? math.simplify(n) : n;
  // console.log('[sort] simplified:', simplified.toString());
  return node.transform((node, path, parent) => {
    // console.log(node.toString(), 'path:', path, 'parent:', parent ? parent.toString() : '');
    if (isCommutativeOperator(node)) {
      // console.log(node.toString(), 'operator node + multiply');
      // console.log(node.fn, 'is commutative', node.toString());
      const args = _.flatten(node.args.map(liftArgs(node.op)));

      // console.log('args:', args);

      const sortedArgs = args.sort((a, b) => a.toString().localeCompare(b.toString()));

      // console.log('>>>>>>> sortedArgs:', args.map(a => a.toString()));
      // const outerSort = node.args.sort((a, b) => a.toString().localeCompare(b.toString()));

      const sorted = sortedArgs.map(n => {
        // console.log('now sort args:', n.toString());
        return sort(n);
      });
      return new expression.node.OperatorNode(node.op, node.fn, sorted);
    }

    return node;
  });
};

// console.log(math.simplify.rules);
const tryEquals = (a, b) => {
  const ap = parse(a);
  const bp = parse(b);

  // console.log(math.simplify(ap).equals(math.simplify(bp)));
  // console.log(JSON.stringify(p1, null, '  '));
  // console.log(JSON.stringify(p2, null, '  '));
  // console.log(JSON.stringify(ap, null, '  '));
  // console.log(JSON.stringify(bp, null, '  '));

  const aps = sort(ap);
  const bps = sort(bp);
  // console.log('aps', aps.toString()); //JSON.stringify(aps, null, '  '));
  // console.log('bps', bps.toString()); //JSON.stringify(bps, null, '  '));
  // // console.log(ap.equals(bp));
  console.log(`'${a}' symbolically equal to '${b}'?`, aps.equals(bps));
};

const messing = () => {
  const ab = parse('a * b * c');
  const ba = parse('a * c * b');
  console.log(math.simplify(ab).equals(ba));
  const result = sort(ab);
  console.log('result:', result.toString());
  const resultTwo = sort(ba);
  console.log('resultTwo:', resultTwo.toString());
  console.log(' outside: >>> ', result.equals(resultTwo));
};

// tryEquals('a * b * c', 'a * c * b');
// tryEquals('a * b * c', ' c  * (b * a)');
// tryEquals('1 * 3 * 40', ' 40 * 1 * (2 +1)');
// tryEquals('a * (d + f) * c', 'a * c * (d + f)');
// tryEquals('percent(40) * 100', 'percent(100) * 40');
// tryEquals('40 % 100 * 2', '2 * 100 % 40');
// tryEquals('a + b + c', 'c + b + a');
// tryEquals('(a - b) + c', 'c + (a - b)');
// tryEquals('(a - b) + c * f', 'c * f + (a - b)');
// tryEquals('overline(a + b) + c', 'c + overline(a + b)');
// tryEquals('overline(a + b) - c', 'c - overline(a + b)');
// tryEquals('a * overline(a + b) * c', 'c * overline(a + b) * a');

// const a = math.parse('1 == 2');
// console.log(a);
// tryEquals('1 != 2', '2 != 1');
// tryEquals('a != b', 'b != a');
// tryEquals('overline(a + b) != foo(c + d)', 'foo(d + c) != overline(b + a)');
// tryEquals('a == b', 'b == a');
// tryEquals('a neq b', 'b neq a');
// const result = sort(math.parse('(a + b) - c'));
// console.log('>>');
// console.log('result:', result.toString(), JSON.stringify(result, null, '  '));
// tryEquals('percent(10) a', 'percent(a) 10');
// tryEquals('10 % a', 'a % 10');
// tryEquals('1 * 2 * 3', '');
// tryEquals('a * (b * c)', 'b * (a * c)');
// const p1 = parse('percent(10) a');
// const p2 = parse('percent(a) 10');

// const p2 = math.parse('percent(a) 10', parseOpts);
// const b1 = math.parse('10 * 0.01 * a');
// const b2 = math.parse('a * 0.01 * 10');

// console.log(JSON.stringify(p1, null, '  '));
// console.log(JSON.stringify(p2, null, '  '));
// // console.log(JSON.stringify(p2, null, '  '));

// console.log(p1.equals(p2));
// console.log(math.simplify(p1).equals(math.simplify(p2)));

// console.log(b1.equals(b2));
// console.log(math.simplify(b1).equals(math.simplify(b2)));
// // // use the function via the expression parser
// // console.log('Using expression parser:');
// // console.log('2+4=' + math.eval('addIt(2, 4)'));
// // // This will output:
// // //
// // //     input: a=2, b=4
// // //     result: 6
// // //     2+4=6

// // // when used via plain JavaScript, the transform is not invoked
// // console.log('');
// // console.log('Using plain JavaScript:');
// // console.log('2+4=' + math.addIt(2, 4));
// // // This will output:
// // //
// // //     6

// class FooNode extends math.expression.node.OperatorNode {
//   constructor(args) {
//     super('foo', 'foo', args);
//     console.log('args:', args);
//   }
// }

// const latex = () => {
//   const a = math.parse('1 lt 2', {
//     nodes: {
//       lt: function(args) {
//         console.log('lt args:', args, arguments);
//       }
//     }
//   });
//   console.log(a);
// };

// latex();

const n = parse('0 != 0');
console.log(JSON.stringify(n, null, '  '));
