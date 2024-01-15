function combineSortedLists(list1, list2, combined) {
  if(combined.length > 0)
    throw "Combined list must start as empty!";

  let lastAdded;
  let i = 0;
  let current1 = list1.head;
  let current2 = list2.head;

  // Figure out which list has next closest value.
  while(current1 || current2) {
    const list1Ended = !current1;
    const list2Ended = !current2;

    if(list2Ended || (!list1Ended && current1.val <= current2.val)) {
      lastAdded = current1.val;
      current1 = current1.next;
    }
    else {
      lastAdded = current2.val;
      current2 = current2.next;
    }

    combined.push(lastAdded);
    i++;
  }

  combined.dump();
  return combined;
}

module.exports = combineSortedLists;