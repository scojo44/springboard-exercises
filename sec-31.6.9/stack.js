/** Node: node for a stack. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** Stack: chained-together nodes where you can
 *  remove from the top or add to the top. */

class Stack {
  constructor() {
    this.bottom = null;
    this.top = null;
    this.size = 0;
  }

  // Names expected by tests
  get first() { return this.top; }
  get last() { return this.bottom; }

  /** push(val): add new value to end of the stack. Returns undefined. */

  push(val) {
    const newNode = new Node(val);

    if(this.isEmpty())
      this.bottom = newNode; // Add to empty stack
    else
      newNode.next = this.top; // Place on the stack

    this.top = newNode;
    this.size++;
  }

  /** pop(): remove the node from the top of the stack
   * and return its value. Should throw an error if the stack is empty. */

  pop() {
    if(this.isEmpty())
      throw Error("Stack is empty!");

    const val = this.top.val;
    this.top = this.top.next;
    this.size--;
    return val;
  }

  /** peek(): return the value of the first node in the stack. */

  peek() {
    return this.top.val;
  }

  /** isEmpty(): return true if the stack is empty, otherwise false */

  isEmpty() {
    return this.size === 0;
  }
}

module.exports = Stack;
