function findRotationCount(nums) {
  console.log("Looking for pivot point in", nums)
  let start = 0;
  let end = nums.length-1
  let pivot = end;

  // See if there's no rotation
  if(nums[0] < nums[nums.length-1])
    return 0;

  // Find the pivot point
  while(nums[pivot] > nums[pivot-1]) {
    if(nums[pivot] < nums[0])
      end = pivot - 1;
    else if(nums[pivot] > nums[0])
      start = pivot + 1;

    pivot = Math.floor((end + start) / 2);

    // Show progress through the search
    console.log(`L:${start}:${nums[start]} P:${pivot}:${nums[pivot]} H:${end}:${nums[end]}`);
  }
  return pivot
}

// module.exports = findRotationCount