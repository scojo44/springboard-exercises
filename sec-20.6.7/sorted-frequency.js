function sortedFrequency(nums, x) {
  console.log("Looking for", x, "in", nums)
  let xstart = -1; // Index of first x
  let xend = -1;   // Index of first num more than x
  let start = 0;
  let end = nums.length-1;

  // Check that x is within the range of the lowest and highest numbers
  if(x < nums[0] || nums[nums.length-1] < x)
    return -1;

  // Check if x starts at the beginning
  if(nums[0] === x)
    xstart = 0;

  // Find the start of the x's
  if(xstart < 0)
    while(start <= end) {
      console.log(start, xstart, end);
      xstart = Math.floor((start + end) / 2);

      if(nums[xstart] >= x)
        end = xstart - 1;
      else
        start = xstart + 1;
    }

  // Reset positions for end search
  start = xstart;
  end = nums.length-1;

  // Check if x ends at the end
  if(nums[nums.length-1] === x)
    xend = nums.length;

  // Find the end of the x's
  if(xend < 0)
    while(start <= end) {
      console.log(start, xend, end);
      xend = start + Math.floor((end - start) / 2);

      if(nums[xend] <= x)
        start = xend + 1;
      else
        end = xend - 1;
    }
    console.log("xstart:", xstart, "xend:", xend, "count:", xend - xstart);
    return xend - xstart;
}

// module.exports = sortedFrequency