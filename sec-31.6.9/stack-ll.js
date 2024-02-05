// Get the LinkedList class from an earlier exercise.
const LinkedList = require('../sec-25.5.12/linked-list');

/** Stack: chained-together nodes where you can
 *  remove from the top or add to the top. */

class Stack {
  #list;

  constructor() {
    this.#list = new LinkedList();
  }

  get top() { return this.#list.tail; }
  get bottom() { return this.#list.head; }
  get size() { return this.#list.length; }
  // Names expected by tests
  get last() { return this.bottom; }
  get first() { return this.top; }

  /** push(val): add new value to end of the stack. Returns undefined. */
  push(val) {
    this.#list.push(val);
  }

  /** pop(): remove the node from the top of the stack
   * and return its value. Should throw an error if the stack is empty. */
  pop() {
    if(this.isEmpty())
      throw Error("Stack is empty!");
    return this.#list.pop();
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
