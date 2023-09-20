/*** Quick Questions ***
1. [1, 2, 3, 4]
2. "ref"
3. { [1,2,3] => true, [1,2,3] => false }
*/

const hasDuplicate = array => array.length > new Set(array).size;

// This one builds an object with counts for each vowel as the solution does
function vowelCounts(str){
  return [...str.toLowerCase()].reduce((vowelMap, letter) => {
    if("aeiou".includes(letter))
      vowelMap.has(letter)? vowelMap.set(letter, vowelMap.get(letter)+1) : vowelMap.set(letter, 1);
    return vowelMap;
  }, new Map());
}

// This one does what the description says to do.
// It converts each vowel to an ID number and uses the ID as the map key.
function vowelCount(str){
  const vowelIDs = {a:1, e:5, i:9, o:15, u:21};

  return [...str.toLowerCase()].reduce((vowelMap, letter) => {
    if("aeiou".includes(letter)){
      const id = vowelIDs[letter];
      vowelMap.has(id)? vowelMap.set(id, vowelMap.get(id)+1) : vowelMap.set(id, 1);
    }
    return vowelMap;
  }, new Map());
}