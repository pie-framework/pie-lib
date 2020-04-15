/* eslint-disable no-console */
const mathjs = require('mathjs');

const rules = [ 
  { l: 'n1^(1/n2)', r: 'nthRoot(n1, n2)' },
  { l: 'sqrt(n1)', r: 'nthRoot(n1, 2)' },
];

const a = '(x-1)^(1/2) + 3';
const b = 'sqrt(x-1, 10)+3';
const ma = mathjs.parse(a);

const mb = mathjs.parse(b);
const sma = mathjs.simplify(ma, rules);
console.log(JSON.stringify(sma, null, "  "))
const smb = mathjs.simplify(mb, rules);
console.log(JSON.stringify(smb, null, "  "))
console.log(sma.equals(smb));

const c = sma.compile();
console.log(c);
console.log(c.eval( {x: 5}))
