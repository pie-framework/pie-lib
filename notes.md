are values equal when they are latex..

areValuesEqual("a \* b", "a \\odot b") // => false

only looking at 2nd param:

- => math expressions parses to "a odot b" string
- => mathjs parses it (with supports the 'odot' operator).
- => Node{ op: "odot", fn: n/a, args: [Node: {name: "a"}, Node: {name: "b"}]}
  so it's an ast, but it's not executable/evaluatable... but we only need the ast.
  but a _ b as an ast !== b _ a as an ast??
