function countZeroes(binary) {
  let start = 0;
  let end = binary.length-1;
  let middle = 0;
  
  while(start <= end){
    middle = start + Math.floor((end - start) / 2);

    if(binary[middle] === 1 && !binary[middle+1]) { // Either zero or undefined, meaning past the end
      middle++;
      break; // Found it!
    }
    else if(binary[middle] === 1)
      start = middle + 1;
    else if(binary[start] === 0) { // Found zero at the start
      middle = 0;
      break; // Found it!
    }
    else
      end = middle - 1;
  }

  return binary.length - middle;
}

// module.exports = countZeroes