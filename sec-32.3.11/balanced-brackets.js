const BRACKET_PAIRS = {
  "{": "}",
  "(": ")",
  "[": "]"
}

function isBalanced(s, i = 0, brackets = []) {
  // Base case
  if(i === s.length) return brackets.length === 0;

  // Normal case
  if("{([".includes(s[i]))
    brackets.push(s[i]);

  if("])}".includes(s[i])) {
    const open = brackets.pop();

    if(BRACKET_PAIRS[open] !== s[i])
      return false; // Fail as soon as mismatch is found
  }

  return isBalanced(s, i+1, brackets);
}

module.exports = isBalanced;
