// Get the DoublyLinkedList class from an earlier exercise.
const DoublyLinkedList = require('../sec-25.5.12/doubly-linked-list');

/** Deque: chained-together nodes where you can
 *  add or remove from the front or back. */

class Deque {
  #list;

  constructor() {
    this.#list = new DoublyLinkedList();
  }

  get first() { return this.#list.head; }
  get last() { return this.#list.tail; }
  get size() { return this.#list.length; }

  /** push(val): add new value to end of list. */
  push(val) {
    this.#list.push(val)
  }

  /** unshift(val): add new value to start of list. */
  unshift(val) {
    this.#list.unshift(val)
  }

  /** pop(): return & remove last item. */
  pop(val) {
    this.#list.pop(val)
  }

  /** shift(): return & remove first item. */
  shift(val) {
    this.#list.shift(val)
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

module.exports = Deque;