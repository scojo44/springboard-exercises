const DoublyLinkedList = require("./doubly-linked-list");

class CircularLinkedList extends DoublyLinkedList {
  get start() {
    return this.head;
  }

  rotate(ticks) {
    const current = this.start;
    let steps = Math.abs(ticks);

    // Walk the list until we reach the one to set as the new start node
    while(steps--)
      current = ticks > 0? current.next : current.prev;

    this.head = current;
    this.tail = current.prev;
  }

  push(val) {
    super.push(val);
    this.#close();
  }

  unshift(val) {
    super.unshift(val);
    this.#close();
  }

  pop() {
    super.pop();
    this.#close();
  }

  shift() {
    super.shift();
    this.#close();
  }

  insertAt(idx) {
    super.insertAt(idx);
    this.#close();
  }

  removeAt(idx) {
    super.removeAt(idx);
    this.#close();
  }

  remove(node) {
    if(node === this.head)
      this.head = node.next;
    if(node === this.tail)
      this.tail = node.prev;

    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.length--;
  }

  reverse() {
    this.#close();
  }

  #close() {
    this.tail.next = this.head;
    this.head.prev = this.tail;
  }
}

module.exports = CircularLinkedList;