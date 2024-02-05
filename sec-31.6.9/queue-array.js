/** Queue: chained-together nodes where you can
 *  remove from the front or add to the back. */

class Queue {
  #array;

  constructor() {
    this.#array = new Array();
  }

  // Tests expect an object with a val property
  get first() { return {val: this.#array[0]} }
  get last() { return {val: this.#array[this.#array.length-1]} }
  get size() { return this.#array.length; }

  /** enqueue(val): add new value to end of the queue. Returns undefined. */
  enqueue(val) {
    this.#array.push(val)
  }

  /** dequeue(): remove the node from the start of the queue
   * and return its value. Should throw an error if the queue is empty. */
  dequeue() {
    if(this.isEmpty())
      throw Error("Queue is empty!");
    return this.#array.shift();
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