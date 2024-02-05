// Get the LinkedList class from an earlier exercise.
const LinkedList = require('../sec-25.5.12/linked-list');

/** Queue: chained-together nodes where you can
 *  remove from the front or add to the back. */

class Queue {
  #list;

  constructor() {
    this.#list = new LinkedList();
  }

  get first() { return this.#list.head; }
  get last() { return this.#list.tail; }
  get size() { return this.#list.length; }

  /** enqueue(val): add new value to end of the queue. Returns undefined. */
  enqueue(val) {
    this.#list.push(val)
  }

  /** dequeue(): remove the node from the start of the queue
   * and return its value. Should throw an error if the queue is empty. */
  dequeue() {
    if(this.isEmpty())
      throw Error("Queue is empty!");
    return this.#list.shift();
  }

  /** peek(): return the value of the first node in the queue. */
  peek() {
    return this.first.val;
  }

  /** isEmpty(): return true if the queue is empty, otherwise false */
  isEmpty() {
    return this.size === 0;
  }
}

module.exports = Queue;