/* ES5 Map Callback */
// Refactor into ES2015
const double = arr => {
  return arr.map(val => {
    return val * 2;
  });
}

// One-liner version
const doubleOneLiner = arr => arr.map(val => val*2);

/* Refactor the following function to use arrow functions: */

const squareAndFindEvens = numbers => {
  var squares = numbers.map(num => num ** 2);
  var evens = squares.filter(square => square % 2 === 0);
  return evens;
}