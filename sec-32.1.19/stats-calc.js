/** Statistics Functions ****************/
function mean(nums){
  const sum = nums.reduce((total, current) => total += current);
  return sum/nums.length;
}

function median(nums){
  nums.sort((a,b) => a - b);
  const half = nums.length/2;
  let middle;
  
  if(nums.length % 2 === 1)
    return nums[Math.floor(half)]; // Center value for odd-numbered length arrays
  else
    return mean([nums[half-1], nums[half]]); // Average two middle values for even-length arrays
}

function mode(nums){
  // Count occurrences of each value
  const counts = {};
  for(let x of nums) {
    if(!counts[x])
      counts[x] = 0; // Initialize counter
    counts[x]++;
  }

  // Find the most frequent value
  let max = Number.MIN_VALUE;
  let top;

  for(let x in counts)
    if(counts[x] > max){
      max = counts[x];
      top = +x;
    }

  return top;
}

function all(nums) {
  return {
    mean: mean(nums),
    median: median(nums),
    mode: mode(nums)
  };
}

/** Support Functions ****************/
function toIntArray(nums){
  return nums.split(',').map(x => +x);
}

module.exports = {mean, median, mode, all, toIntArray};