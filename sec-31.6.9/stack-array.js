/** Stack: chained-together nodes where you can
 *  remove from the top or add to the top. */

class Stack {
  #array;

  constructor() {
    this.#array = new Array();
  }

  // Tests expect an object with a val property
  get top() { return {val: this.#array[this.#array.length-1]} }
  get bottom() { return {val: this.#array[0]} }
  get size() { return this.#array.length; }
  // Names expected by tests
  get first() { return this.top; }
  get last() { return this.bottom; }

  /** push(val): add new value to the top of the stack. Returns undefined. */
  push(val) {
    this.#array.push(val);
  }

  /** pop(): remove the node from the top of the stack
   * and return its value. Should throw an error if the stack is empty. */
  pop() {
    if(this.isEmpty())
      throw Error("Stack is empty!");
    return this.#array.pop();
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
