// Generate an array of random, yet sorted, numbers
const randoms = [1] // Start with one element since the generator loop looks at the previous element.
for(let i = 1; i < 1000; i++) {
  const jump = Math.ceil(Math.random()*3);
  randoms.push(randoms[i-1] + jump);
}

/** Search for values in the above randoms array */
function binarySearchRandoms(query) {
  let result = -1;
  let lowest = 0;
  let highest = randoms.length-1
  let loopCount = 1;

  while(lowest <= highest && loopCount < 100) { // Use loopCount as a safety to avoid infinite loops
    const middle = Math.floor((highest + lowest) / 2);

    if(randoms[middle] > query)
      highest = middle - 1;
    else if(randoms[middle] < query)
      lowest = middle + 1;
    else
      result = middle; // Found it!

    // Show progress through the search
    console.log(loopCount++, `L:${lowest} M:${middle} H:${highest}`);

    // Breaking out like this allows every iteration to be console.logged.
    if(randoms[middle] === query)
      break;
  }

  console.log("Result:", result, "- IndexOf:", randoms.indexOf(query));
}