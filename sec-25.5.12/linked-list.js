/** Node: node for a singly linked list. */

class Node {
  constructor(val){
    this.val = val;
    this.next = null;
  }
}

/** LinkedList: chained together nodes. */

class LinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) this.push(val);
  }

  /** printList(): visualize the whole list. */

  printList(){
    if(!this.length) { console.log("List is empty!"); return; };
    if(!this.head)   { console.log("Head is null!"); return; };
    if(!this.tail)   { console.log("Tail is null!"); return; };

    let output = `[Head:${this.head.val}] > `;
    let current = this.head.next;
    let loop = 1;

    if(this.length > 1)
      while(current && loop++ < this.length){
        output += `[${current.val}] > `;
        current = current.next;
      }

    output = output.replace(/\] > $/, ":Tail]")
    console.log(" LL", output, "Length:"+this.length);
  }

  /** toArray(): return the list as an array. */

  toArray() {
    const array = [];
    let current = this.head;
    let loop = 0;

    while(current && loop++ < this.length){
      array.push(current.val);
      current = current.next;
    }
    return array;
  }

  /** push(val): add new value to end of list. */

  push(val) {
    const node = new Node(val);

    // Edge case: Empty list
    // Set head and tail to new node.
    if(!this.head){
      this.head = node;
      this.tail = node;
    }
    else{
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
  }

  /** unshift(val): add new value to start of list. */

  unshift(val) {
    const node = new Node(val);

    // Edge case: Empty list
    // Set head and tail to new node.
    if(!this.head){
      this.head = node;
      this.tail = node;
    }
    else{
      node.next = this.head;
      this.head = node;
    }

    this.length++;
  }

  /** pop(): return & remove last item. */

  pop() {
    // Error: Empty list
    if(!this.head)
      throw new Error("List is empty.");

    // Edge case: Only one item in the list
    if(this.head === this.tail){
      const tailValue = this.head.val;
      this.head = this.tail = null;
      this.length--;
      return tailValue;
    }

    // Find the next to last node.
    let current = this.head;

    while(current.next !== this.tail){
      current = current.next;
    }

    // Remove last node from list and return its value.
    const tailValue = this.tail.val;
    current.next = null;
    this.tail = current;
    this.length--;
    return tailValue;
  }

  /** shift(): return & remove first item. */

  shift() {
    // Error: Empty list
    if(!this.head)
      throw new Error("List is empty.");

    // Edge case: Only one item in the list
    if(this.head === this.tail){
      const headValue = this.head.val;
      this.head = this.tail = null;
      this.length--;
      return headValue;
    }

    // Remove the first node in list and return its value.
    const headValue = this.head.val;
    this.head = this.head.next;
    this.length--;
    return headValue;
  }

  /** getAt(idx): get val at idx. */

  getAt(idx) {
    // Error: Empty list
    if(!this.head)
      throw new Error("List is empty.");

    // Error: idx is beyond the end of the list.
    if(idx >= this.length)
      throw new Error("Index is past the end of the list.  Last index is " + this.length-1);

    // Edge case: idx is the end of the list.
    if(idx === this.length-1)
      return this.tail.val;

    // Search for node[idx]
    let current = this.head;
    let count = 0;

    while(count < idx){
      current = current.next;
      count++;
    }

    return current.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {
    // Error: idx is beyond the end of the list.
    if(idx >= this.length)
      throw new Error("Index is past the end of the list.  Last index is " + this.length-1);

    // Search for node[idx]
    let current = this.head;
    let count = 0;

    while(count < idx){
      current = current.next;
      count++;
    }

    current.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {
    // Error: idx is beyond the end of the list.
    if(idx > this.length)
      throw new Error("Index is past the end of the list.  Last index is " + this.length-1);

    const node = new Node(val);

    // Edge case: Empty list
    // Set head and tail to new node if given index is 0.
    if(idx === 0 && this.length === 0){
      this.head = node;
      this.tail = node;
      this.length++;
      return;
    }

    // Edge case: Inserting at index 0, but list is not empty.
    if(idx === 0){
      node.next = this.head;
      this.head = node;
      this.length++;
      return;
    }

    // Edge case: Inserting at end of the list.
    if(idx === this.length){
      this.tail.next = node;
      this.tail = node;
      this.length++;
      return;
    }

    // Search for node[idx]
    let current = this.head;
    let count = 0;

    while(count < idx-1){
      current = current.next;
      count++;
    }

    node.next = current.next;
    current.next = node;
    this.length++;
  }

  /** removeAt(idx): return & remove item at idx, */

  removeAt(idx) {
    // Error: idx is beyond the end of the list.
    if(idx >= this.length)
      throw new Error("Index is past the end of the list.  Last index is " + this.length-1);

    // Edge case: Removing at index 0 with only one node.
    if(this.length === 1){
      const removedValue = this.head.val;
      this.head = null;
      this.tail = null;
      this.length--;
      return removedValue;
    }

    // Search for node[idx]
    let current = this.head;
    let count = 0;

    while(count < idx-1){
      current = current.next;
      count++;
    }

    const removedValue = current.next.val;

    if(current.next.next)
      current.next = current.next.next;
    else{ // Removing from the end
      current.next = null;
      this.tail = current;
    }

    this.length--;
    return removedValue;
  }

  /** average(): return an average of all values in the list */

  average() {
    // Edge case: Empty list
    if(this.length === 0)
      return 0;

    // Get a sum of all node values.
    let current = this.head;
    let total = 0;
    let loop = 0;

    while(current && loop++ < this.length){
      total += current.val;
      current = current.next;
    }

    return total/this.length;
  }

  /** reverse(): reverse the list in place. */

  reverse() {
    // Edge case: Empty list or only one node.
    if(this.length <= 1)
      return;

    let i = this.length - 1;
    const originalTail = this.tail;
    
    // Traverse nodes from the end setting next to the one before it.
    while(i >= 0){
      // Find the next node to change its next value .
      let current = this.head;
      let j = 0;

      while(j < i-1){
        // console.log(i, j, current.val, this.tail.val);
        current = current.next;
        j++;
      }

      // Set next to the node before it using this.tail to hold the previous node,
      this.tail.next = current;
      this.tail = current;
      i--;
    }

    // Update head and tail.
    this.tail = this.head;
    this.head = originalTail;
    this.tail.next = null;
  }
}

function combineSortedLists(list1, list2, combined){
  if(combined.length > 0)
    throw "Combined list must start as empty!";

  let lastAdded;
  let i = 0;
  let current1 = list1.head;
  let current2 = list2.head;

  // Figure out which list has next closest value.
  while(current1 || current2){
    const list1Ended = !current1;
    const list2Ended = !current2;

    if(list2Ended || (!list1Ended && current1.val <= current2.val)){
      lastAdded = current1.val;
      current1 = current1.next;
    }
    else{
      lastAdded = current2.val;
      current2 = current2.next;
    }

    combined.push(lastAdded);
    i++;
  }

  combined.dump();
  return combined;
}

module.exports = LinkedList;