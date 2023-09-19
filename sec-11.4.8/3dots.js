function filterOutOdds(...numbers){
  return numbers.filter(x => x % 2 === 0);
}

function findMin(...numbers){
  return numbers.reduce((min, next) => next < min? next : min);
}

function mergeObjects(o1, o2){
  return {...o1, ...o2};
}

function doubleAndReturnArgs(array, ...numbers){
  return [...array, ...numbers.map(x => x * 2)];
}

/***** Slice & Dice! *****/

/** remove a random element in the items array
and return a new array without that item. */
function removeRandom(items){
  const i = Math.floor(Math.random() * items.length);
  return [...items.slice(0, i), ...items.slice(i+1)];
}

/** Return a new array with every item in array1 and array2. */
function extend(array1, array2) {
  return [...array1, ...array2];
}

/** Return a new object with all the keys and values
from obj and a new key/value pair */
function addKeyVal(obj, key, val) {
  const newObj = {...obj};
  newObj[key] = val;
  return newObj;
}

/** Return a new object with a key removed. */
function removeKey(obj, key) {
  const liteObj = {...obj};
  delete liteObj[key];
  return liteObj;
}

/** Combine two objects and return a new object. */
function combine(obj1, obj2) {
  return {...obj1, ...obj2};
}

/** Return a new object with a modified key and value. */
function update(obj, key, val) {
  const newObj = {...obj};
  newObj[key] = val;
  return newObj;
}