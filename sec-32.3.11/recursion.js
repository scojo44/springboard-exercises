/** product: calculate the product of an array of numbers. */

function product(nums, i = 0) {
  // Base case
  if(i === nums.length) return 1; // Make sure accumulated result is returned unchanged

  // Normal case
  return nums[i] * product(nums, i + 1);
}

/** longest: return the length of the longest word in an array of words. */

function longest(words, i = 0, highScore = 0) {
  // Base case
  if(i === words.length) return highScore;

  // Normal case
  highScore = Math.max(words[i].length, highScore);
  return longest(words, i + 1, highScore);
}

/** everyOther: return a string with every other letter. */

function everyOther(str, i = 0) {
  // Base case
  if(i === str.length) return '';

  // Normal case
  const letter = i % 2 == 0? str[i] : '';
  return letter + everyOther(str, i + 1);
}

/** isPalindrome: checks whether a string is a palindrome or not. */

function isPalindrome(str, i = 0) {
  // Base case
  if(i >= str.length/2) return true;

  // Normal case
  const same = str[i] === str[str.length-1 - i]; // Compare same index from start and end
  if(!same) return false; // Stop as soon as a mismatch is found

  return same && isPalindrome(str, i + 1);
}

/** findIndex: return the index of val in arr (or -1 if val is not present). */

function findIndex(array, value, i = 0) {
  // Base case
  if(i === array.length) return -1;

  // Normal case
  if(array[i] === value) return i;
  return findIndex(array, value, i + 1);
}

/** revString: return a copy of a string, but in reverse. */

function revString(str, i = 0) {
  // Base case
  if(i === str.length) return '';

  // Normal case
  const letter = str[str.length-1 - i];
  return letter + revString(str, i + 1);
}

/** gatherStrings: given an object, return an array of all of the string values. */

function gatherStrings(obj, i = 0, strings = []) {
  const keys = Object.keys(obj);

  // Base case
  if(i === keys.length) return strings;

  // Normal case
  switch(typeof(obj[keys[i]])) {
    case 'string':
      strings.push(obj[keys[i]]);
      break;
    case 'object':
      strings = [...strings, ...gatherStrings(obj[keys[i]])];
  }

  return gatherStrings(obj, i + 1, strings);
}

/** binarySearch: given a sorted array of numbers, and a value,
 * return the index of that value (or -1 if val is not present). */

function binarySearch(array, value, low = 0, high = array.length-1) {
  // Base case
  if(low > high) return -1;

  // Normal case
  const middle = Math.floor((high + low) / 2)

  if(array[middle] > value)
    high = middle - 1;
  else if(array[middle] < value)
    low = middle + 1;
  else
    return middle; // Found it!

  // console.log(`L:${low} M:${middle} H:${high}`);
  return binarySearch(array, value, low, high);
}

module.exports = {
  product,
  longest,
  everyOther,
  isPalindrome,
  findIndex,
  revString,
  gatherStrings,
  binarySearch
};
