const findRotationCount = require("./find-rotation-count")

function findRotatedIndex(nums, x) {
  console.log("Looking for", x, "in", nums)

  const pivot = findRotationCount(nums); // Using another function in this exercise
  // Search the first half of the array
  let index = binarySearch(nums.slice(0, pivot), x);

  // Search the second half of the array
  if(index === -1){
    index = binarySearch(nums.slice(pivot), x);
    if(index > -1)
      index += pivot;
  }

  console.log("Pivot:", pivot, "Index:", index);
  return index;
}

/** Search for values in the above randoms array */
function binarySearch(nums, x) {
  console.log("Looking for", x, "in", nums)

  let index = -1;
  let start = 0;
  let end = nums.length-1

  while(start <= end) {
    const middle = Math.floor((end + start) / 2);

    if(nums[middle] > x)
      end = middle - 1;
    else if(nums[middle] < x)
      start = middle + 1;
    else
      index = middle; // Found it!

    // Show progress through the search
    console.log(`L:${start} M:${middle} H:${end}`);

    // Breaking out like this allows every iteration to be console.logged.
    if(nums[middle] === x)
      break;
  }
  console.log("Result:", index, "- IndexOf:", nums.indexOf(x));
  return index;
}

module.exports = findRotatedIndex