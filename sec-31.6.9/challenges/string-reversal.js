const Stack = require('../stack-ll');

function reverseString(s) {
  const stack = new Stack();
  let reversed = "";

  for(let c of s)
    stack.push(c);

  while(!stack.isEmpty())
    reversed += stack.pop();

  return reversed;
}

console.log(reverseString("Always learning!"));