function findFloor(nums, x) {
  console.log("Looking for", x, "in", nums)
  let floor = -1;
  let start = 0;
  let end = nums.length-1

  // Edge cases
  if(x < nums[0])
    return -1;
  if(nums[nums.length-1] < x)
    return nums[nums.length-1];

  while(start <= end) {
    const middle = Math.floor((end + start) / 2);

    if(nums[middle] <= x & nums[middle+1] > x) {
      floor = middle;
      break; // Found it!
    }
    if(nums[middle] > x)
      end = middle - 1;
    else if(nums[middle] < x)
      start = middle + 1;

    // Show progress through the search
    console.log(`L:${start} M:${middle} H:${end}`);

    // Breaking out like this allows every iteration to be console.logged.
    if(nums[middle] === x)
      break;
  }

  console.log("Result:", nums[floor]);
  return nums[floor];
}

module.exports = findFloor