are values equal when they are latex..

areValuesEqual("a \* b", "a \\odot b") // => false

only looking at 2nd param:

- => math expressions parses to "a odot b" string
- => mathjs parses it (with supports the 'odot' operator).
- => Node{ op: "odot", fn: n/a, args: [Node: {name: "a"}, Node: {name: "b"}]}
  so it's an ast, but it's not executable/evaluatable... but we only need the ast.
  but a _ b as an ast !== b _ a as an ast?? (would have to apply some form of sort).

So the hurdles would be 1. add parse in `math-expressions`, 2. add support for `odot` to mathjs, 3. apply a sort to the mathjs ast, then we could check for equality

As ever the question is - what do learnosity do?

Is it a simple as try/catch the parse error? if one parses and the other doesn't they can't be equal?

What if odot is part of the correct answer?

Mathcore equivSymbolic line 7748 - authoring demo site.

```
itemId: 4028e4a24c148ad7014c51e4556b6c0c
"answer": "x=\\frac{20,000}{r^2}\\ \\text{radians}"
```
