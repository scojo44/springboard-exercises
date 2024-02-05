/** Node: node for a singly linked list. */

class DNode {
  constructor(val){
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

/** DoublyLinkedList: chained together nodes. */

class DoublyLinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals)
      this.push(val);
  }

  /** printList(): visualize the whole list. */

  printList(){
    if(!this.length) { console.log("List is empty!"); return; };
    if(!this.head)   { console.log("Head is null!"); return; };
    if(!this.tail)   { console.log("Tail is null!"); return; };

    // Write out the chain of next nodes.
    let output = `[Head:${this.head.val}] > `;
    let fromHead = this.head.next;
    
    if(this.length > 1)
      while(fromHead && fromHead !== this.head){
        output += `[${fromHead.val}] > `;
        fromHead = fromHead.next;
      }

    output = output.replace(/\] > $/, ":Tail]")
    console.log("DLL", output, "Length:"+this.length);

    // Skip the previous node chain if only one node.
    if(this.length === 1)
      return;

    // Write out the chain of previous nodes.
    output = `    [Head:${this.head.val}]`;
    fromHead = this.head.next;

    while(fromHead.next && fromHead.next !== this.head){
      output += ` < [${fromHead.val}]`;
      fromHead = fromHead.next;
    }

    output += ` < [${this.tail.val}:Tail]`;
    console.log(output);
  }

  /** toArray(): return the list as an array. */

  toArray() {
    const array = [];
    let current = this.head;

    while(current.next && current.next !== this.head){
      array.push(current.val);
      current = current.next;
    }
    return array;
  }

  /** push(val): add new value to end of list. */

  push(val) {
    const node = new DNode(val);

    // Edge case: Empty list
    // Set head and tail to new node.
    if(!this.head){
      this.head = node;
      this.tail = node;
    }
    else{
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
  }

  /** unshift(val): add new value to start of list. */

  unshift(val) {
    const node = new DNode(val);

    // Edge case: Empty list
    // Set head and tail to new node.
    if(!this.head){
      this.head = node;
      this.tail = node;
    }
    else{
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }

    this.length++;
  }

  /** pop(): return & remove last item. */

  pop() {
    // Error: Empty list
    if(!this.head)
      throw new Error("List is empty.");

    let current = this.head;

    // Edge case: Only one item in the list
    if(this.head === this.tail){
      const tailValue = this.head.val;
      this.head = this.tail = null;
      this.length--;
      return tailValue;
    }

    // Remove last node from list and return its value.
    const tailValue = this.tail.val;
    this.tail.prev.next = null;
    this.tail = this.tail.prev;
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
    this.head.next.prev = null;
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

    // Search for node[idx]
    let current;
    
    if(idx < this.length/2){
      // Search from head if idx in first half of list.
      let count = 0;
      current = this.head;

      while(count < idx){
        current = current.next;
        count++;
      }
    }
    else{ // Search from tail if idx in second half of list.
      let count = this.length-1;
      current = this.tail;

      while(count > idx){
        current = current.prev;
        count--;
      }
    }

    return current.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {
    // Error: idx is beyond the end of the list.
    if(idx >= this.length)
      throw new Error("Index is past the end of the list.  Last index is " + this.length-1);

    // Search for node[idx]
    let current;

    if(idx < this.length/2){
      // Search from head if idx in first half of list.
      let count = 0;
      current = this.head;

      while(count < idx){
        current = current.next;
        count++;
      }
    }
    else{ // Search from tail if idx in second half of list.
      let count = this.length-1;
      current = this.tail;

      while(count > idx){
        current = current.prev;
        count--;
      }
    }

    current.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {
    const node = new DNode(val);

    // Error: idx is beyond the end of the list.
    if(idx > this.length)
      throw new Error("Index is past the end of the list.  Last index is " + this.length-1);

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
      this.head.prev = node;
      this.head = node;
      this.length++;
      return;
    }

    // Edge case: Inserting at end of the list.
    if(idx === this.length){
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
      this.length++;
      return;
    }

    // Search for node[idx]
    let current;
    
    if(idx < this.length/2){
      // Search from head if idx in first half of list.
      let count = 0;
      current = this.head;

      while(count < idx){
        current = current.next;
        count++;
      }
    }
    else{ // Search from tail if idx in second half of list.
      let count = this.length-1;
      current = this.tail;

      while(count >= idx){ // Look for the current at idx to insert after it.
        current = current.prev;
        count--;
      }
    }

    node.next = current.next;
    node.prev = current;
    current.next.prev = node;
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

    // Edge case: Removing from the end of the list.
    if(idx === this.length-1){
      const removedValue = this.tail.val;
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
      this.length--;
      return removedValue;
    }

    // Search for node[idx]
    let current;
    let removedValue;

    if(idx < this.length/2){
      // Search from head if idx in first half of list.
      let count = 0;
      current = this.head;

      while(count < idx){
        current = current.next;
        count++;
      }

      removedValue = current.val;
      current.prev.next = current.next;
      current.next.prev = current.prev;
    }
    else{ // Search from tail if idx in second half of list.
      let count = this.length-1;
      current = this.tail;

      while(count > idx){ // Look for the current at idx to insert after it.
        current = current.prev;
        count--;
      }
      removedValue = current.val;
      current.next.prev = current.prev;
      current.prev.next = current.next;
    }

    this.length--;
    return removedValue;
  }

  /** average(): return an average of all values in the list
   *  No different from LinkedList so it changed it to go backwards.
   */

  average() {
    // Edge case: Empty list
    if(this.length === 0)
      return 0;

    // Get a sum of all node values.
    let current = this.tail;
    let sum = 0;

    while(current.next && current.next !== this.head){
      sum += current.val;
      current = current.prev;
    }

    return sum/this.length;
  }

  /** reverse(): reverse the list in place. */

  reverse() {
    // Edge case: Empty list or only one node.
    if(this.length <= 1)
      return;

    let i = 0;
    const originalTail = this.tail;
    let fromHead = this.head;
    let fromTail = this.tail;

    // Walk the list and just swap next and prev!
    while(fromHead){
      const next = fromHead.next;
      [fromHead.next, fromHead.prev] = [fromHead.prev, fromHead.next];
      fromHead = next;
    }

    // Swap head and tail.
    [this.head, this.tail] = [this.tail, this.head];
  }
}

module.exports = DoublyLinkedList;