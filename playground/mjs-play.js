const mathjs = require('mathjs');

function foo(args, math, scope) {
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
foo.rawArgs = true;

// import the new function in the math namespace

mathjs.import({
  foo
});

const r = v => mathjs.rationalize(v);
const a = mathjs.parse('4 x');
const b = mathjs.parse('x 4');

const mo = tree => JSON.stringify(tree, null, '  ');
// console.log('a:', mo(a));
// console.log('b:', mo(b));
// console.log(a.equals(b));
// console.log(r(a).equals(r(b)));

const c = mathjs.parse('3 * foo(4 + 1)');
const d = mathjs.parse('foo(1 + 4) * 3');
console.log('c:', mo(c));
console.log('d:', mo(d));
console.log('>>>>>>>>>>>>> c === d?', c.equals(d));

const cr = mathjs.simplify(c);
const dr = mathjs.simplify(d);
// const dr = r(d);
// console.log('cr:', mo(cr));
// console.log('dr:', mo(dr));
console.log('post simplify', cr.equals(dr));
