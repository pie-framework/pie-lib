const mathjs = require('mathjs');

function percent(args, math, scope) {
  console.log('[percent] ', args);
  // get string representation of the arguments
  const str = args.map(function(arg) {
    return arg.toString();
  });

  // evaluate the arguments
  const res = args.map(function(arg) {
    return arg.compile().evaluate(scope);
  });

  return 'arguments: ' + str.join(',') + ', evaluated: ' + res.join(',');
}

// mark the function as "rawArgs", so it will be called with unevaluated arguments
percent.rawArgs = false;

// import the new function in the math namespace

mathjs.import({
  percent
});

// const r = v => mathjs.rationalize(v);
// const a = mathjs.parse('4 x');
// const b = mathjs.parse('x 4');

const mo = tree => JSON.stringify(tree, null, '  ');
// // console.log('a:', mo(a));
// // console.log('b:', mo(b));
// // console.log(a.equals(b));
// // console.log(r(a).equals(r(b)));

// const c = mathjs.parse('3 * foo(4 + 1)');
// const d = mathjs.parse('foo(1 + 4) * 3');
// console.log('c:', mo(c));
// console.log('d:', mo(d));
// console.log('>>>>>>>>>>>>> c === d?', c.equals(d));

// const cr = mathjs.simplify(c);
// const dr = mathjs.simplify(d);
// // const dr = r(d);
// // console.log('cr:', mo(cr));
// // console.log('dr:', mo(dr));
// console.log('post simplify', cr.equals(dr));

// const nOne = mathjs.parse("a != b")
// const nTwo = mathjs.parse("b != a")
// console.log(mo(nOne));
// console.log(mo(nTwo));
// console.log("are the same?", mathjs.simplify(nOne).equals(mathjs.simplify(nTwo)));

// const p1 = mathjs.parse('(10 * 0.01) 100');
// const p2 = mathjs.parse(' 100 (10 * 0.01)');

// 10% 22
// => (10 * 0.01) * 22
// 22% 10
// => (22 * 0.01) * 10

// const p1 = mathjs.parse('(10 * 0.01) 22');
// const p2 = mathjs.parse(' (22 * 0.01) 10');
const p1 = mathjs.parse('percent(10) 22');
const p2 = mathjs.parse('percent(22) 10');

console.log('mo', mo(p1));
console.log(p1.equals(p2));
console.log(mathjs.simplify(p1).equals(mathjs.simplify(p2)));
