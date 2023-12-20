// const DoublyLinkedList = require("./linked-list");

describe("DLL.push", function() {
  it("appends node and increments length", function() {
    let lst = new DoublyLinkedList();

    lst.push(5);
    expect(lst.length).toBe(1);
    expect(lst.head.val).toBe(5);
    expect(lst.tail.val).toBe(5);

    lst.push(10);
    expect(lst.length).toBe(2);
    expect(lst.head.val).toBe(5);
    expect(lst.head.next.val).toBe(10);
    expect(lst.tail.val).toBe(10);

    lst.push(15);
    expect(lst.length).toBe(3);
    expect(lst.head.val).toBe(5);
    expect(lst.head.next.next.val).toBe(15);
    expect(lst.tail.val).toBe(15);
    expect(lst.tail.prev.val).toBe(10); // Added
  });
});

describe("DLL.unshift", function() {
  it("adds node at start and increments length", function() {
    let lst = new DoublyLinkedList();

    lst.unshift(5);
    expect(lst.length).toBe(1);
    expect(lst.head.val).toBe(5);
    expect(lst.tail.val).toBe(5);

    lst.unshift(10);
    expect(lst.length).toBe(2);
    expect(lst.head.val).toBe(10);
    expect(lst.head.next.val).toBe(5);
    expect(lst.tail.val).toBe(5);

    lst.unshift(15);
    expect(lst.length).toBe(3);
    expect(lst.head.val).toBe(15);
    expect(lst.head.next.next.val).toBe(5);
    expect(lst.head.next.prev.val).toBe(15); // Added
    expect(lst.tail.val).toBe(5);
  });
});

describe("DLL.pop", function() {
  it("removes node at end and decrements length", function() {
    let lst = new DoublyLinkedList([5, 10]);

    expect(lst.pop()).toBe(10);
    expect(lst.head.val).toBe(5);
    expect(lst.tail.val).toBe(5);
    expect(lst.length).toBe(1);

    expect(lst.pop()).toBe(5);
    expect(lst.tail).toBe(null);
    expect(lst.head).toBe(null);
    expect(lst.length).toBe(0);
  });
});

describe("DLL.shift", function() {
  it("removes node at start and decrements length", function() {
    let lst = new DoublyLinkedList([5, 10, 15]);

    expect(lst.shift()).toBe(5);
    expect(lst.head.next.prev.val).toBe(10); // Added
    expect(lst.tail.val).toBe(15);
    expect(lst.length).toBe(2);

    expect(lst.shift()).toBe(10); // Added
    expect(lst.shift()).toBe(15);
    expect(lst.tail).toBe(null);
    expect(lst.head).toBe(null);
    expect(lst.length).toBe(0);
  });
});

describe("DLL.getAt", function() {
  it("gets val at index", function() {
    let lst = new DoublyLinkedList([5, 10, 15, 20, 25]);

    expect(lst.getAt(0)).toBe(5);
    expect(lst.getAt(1)).toBe(10);
    expect(lst.getAt(2)).toBe(15); //
    expect(lst.getAt(3)).toBe(20); // Added
    expect(lst.getAt(4)).toBe(25); //
  });
});

describe("DLL.setAt", function() {
  it("sets val at index", function() {
    let lst = new DoublyLinkedList([5, 10, 15, 20, 25]);

    expect(lst.setAt(0, 1));
    expect(lst.setAt(1, 2));
    expect(lst.setAt(2, 3)); //
    expect(lst.setAt(3, 4)); // Added
    expect(lst.setAt(4, 5)); //
    expect(lst.head.val).toBe(1);
    expect(lst.head.next.val).toBe(2);
    expect(lst.tail.val).toBe(5);       // Added
    expect(lst.tail.prev.val).toBe(4); //
  });
});

describe("DLL.insertAt", function() {
  it("inserts node and adjusts nearby nodes", function() {
    let lst = new DoublyLinkedList([5, 10, 15, 20]);

    lst.insertAt(2, 12);
    expect(lst.length).toBe(5);
    expect(lst.head.val).toBe(5);
    expect(lst.head.next.val).toBe(10);
    expect(lst.head.next.next.val).toBe(12);
    expect(lst.head.next.next.next.val).toBe(15);
    expect(lst.head.next.next.next.next.val).toBe(20);

    // Added another insert
    lst.insertAt(4, 18);
    expect(lst.length).toBe(6);
    expect(lst.head.next.next.next.next.val).toBe(18);
    expect(lst.head.next.next.next.next.next.val).toBe(20);

    lst.insertAt(lst.length, 25);
    expect(lst.head.next.next.next.next.next.next.val).toBe(25);
    expect(lst.tail.val).toBe(25);
  });

  it("inserts into empty list", function() {
    let lst = new DoublyLinkedList();

    lst.insertAt(0, 5);
    expect(lst.length).toBe(1);
    expect(lst.head.val).toBe(5);
    expect(lst.tail.val).toBe(5);
  });
});

describe("DLL.removeAt", function() {
  it("removes node and adjusts nearby nodes", function() { // Added test
    let lst = new DoublyLinkedList(["a", "b", "c", "d", "e", "f"]);

    lst.removeAt(2);
    expect(lst.length).toBe(5);
    expect(lst.head.val).toBe("a");
    expect(lst.head.next.next.val).toBe("d");
    
    lst.removeAt(3);
    expect(lst.length).toBe(4);
    expect(lst.tail.prev.val).toBe("d");
    expect(lst.tail.val).toBe("f");
  });

  it("removes from 1-item list", function() {
    let lst = new DoublyLinkedList(["a"]);

    lst.removeAt(0);
    expect(lst.length).toBe(0);
    expect(lst.head).toBe(null);
    expect(lst.tail).toBe(null);
  });
});

describe("DLL.average", function() {
  it("calculates the average of items in a list", function() {
    let lst = new DoublyLinkedList([2, 3, 1, 1, 7, 6, 9]);
    expect(lst.average()).toBeCloseTo(4.1429, 4);
  });

  it("returns 0 for empty lists", function() {
    let lst = new DoublyLinkedList();
    expect(lst.average()).toBe(0);
  });
});

describe("DLL.reverse", function() { // Added
  it("reverses the items in a list", function() {
    let lst = new DoublyLinkedList([2, 3, 1, 1, 7, 6, 9]);

    lst.reverse();
    expect(lst.toArray()).toEqual([9, 6, 7, 1, 1, 3, 2]);
  });
});

describe("combineSortedLists(dll1, dll2)", function() { // Added
  it("combines two sorted lists", function() {
    let lst1 = new DoublyLinkedList([-9, -6, -3, 0, 3, 6, 9, 12]);
    let lst2 = new DoublyLinkedList([-3, -2, -1, 0, 1, 2, 3, 4, 5]);

    result = combineSortedLists(lst1, lst2, new DoublyLinkedList()).toArray();
    expect(result.length).toBe(17);
    expect(result).toEqual([-9, -6, -3, -3, -2, -1, 0, 0, 1, 2, 3, 3, 4, 5, 6, 9, 12]);
  });
});