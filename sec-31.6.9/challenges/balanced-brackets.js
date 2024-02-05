const Stack = require('../stack-ll');

function isBalanced(s) {
  const brackets = new Stack();

  for(let c of s) {
    if("{([".includes(c))
      brackets.push(c);

    if("])}".includes(c)) {
      const open = brackets.pop();
      if(open === "{" && c !== "}")  return false;
      if(open === "(" && c !== ")")  return false;
      if(open === "[" && c !== "]")  return false;
    }
  }

  return brackets.isEmpty();
}

console.log("=== Should be true");
console.log("hello", isBalanced("hello"));
console.log("(hi) [there]", isBalanced("(hi) [there]"));
console.log("(hi [there])", isBalanced("(hi [there])"));
console.log("(((hi)))", isBalanced("(((hi)))"));
console.log("=== Should be false");
console.log("(hello", isBalanced("(hello"));
console.log("(nope]", isBalanced("(nope]"));
console.log("((ok) [nope)]", isBalanced("((ok) [nope)]"));