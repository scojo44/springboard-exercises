// const LinkedList = require("./linked-list");

describe("LL.push", function() {
  it("appends node and increments length", function() {
    let lst = new LinkedList();

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
  });
});

describe("LL.unshift", function() {
  it("adds node at start and increments length", function() {
    let lst = new LinkedList();

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
    expect(lst.tail.val).toBe(5);
  });
});

describe("LL.pop", function() {
  it("removes node at end and decrements length", function() {
    let lst = new LinkedList([5, 10]);

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

describe("LL.shift", function() {
  it("removes node at start and decrements length", function() {
    let lst = new LinkedList([5, 10]);

    expect(lst.shift()).toBe(5);
    expect(lst.tail.val).toBe(10);
    expect(lst.length).toBe(1);

    expect(lst.shift()).toBe(10);
    expect(lst.tail).toBe(null);
    expect(lst.head).toBe(null);
    expect(lst.length).toBe(0);
  });
});

describe("LL.getAt", function() {
  it("gets val at index", function() {
    let lst = new LinkedList([5, 10]);

    expect(lst.getAt(0)).toBe(5);
    expect(lst.getAt(1)).toBe(10);
  });
});

describe("LL.setAt", function() {
  it("sets val at index", function() {
    let lst = new LinkedList([5, 10]);

    expect(lst.setAt(0, 1));
    expect(lst.setAt(1, 2));
    expect(lst.head.val).toBe(1);
    expect(lst.head.next.val).toBe(2);
  });
});

describe("LL.insertAt", function() {
  it("inserts node and adjusts nearby nodes", function() {
    let lst = new LinkedList([5, 10, 15, 20]);

    lst.insertAt(2, 12);
    expect(lst.length).toBe(5);
    expect(lst.head.val).toBe(5);
    expect(lst.head.next.val).toBe(10);
    expect(lst.head.next.next.val).toBe(12);
    expect(lst.head.next.next.next.val).toBe(15);
    expect(lst.head.next.next.next.next.val).toBe(20);

    lst.insertAt(5, 25);
    expect(lst.head.next.next.next.next.next.val).toBe(25);
    expect(lst.tail.val).toBe(25);
  });

  it("inserts into empty list", function() {
    let lst = new LinkedList();

    lst.insertAt(0, 5);
    expect(lst.length).toBe(1);
    expect(lst.head.val).toBe(5);
    expect(lst.tail.val).toBe(5);
  });
});

describe("LL.removeAt", function() {
  it("removes node and adjusts nearby nodes", function() { // Added test
    let lst = new LinkedList(["a", "b", "c", "d"]);

    expect(lst.removeAt(1)).toBe("b");
    expect(lst.length).toBe(3);
    expect(lst.head.val).toBe("a");
    expect(lst.head.next.val).toBe("c");
  });

  it("removes node and adjusts nearby nodes", function() { // Added test
    let lst = new LinkedList(["a", "b", "c", "d"]);

    expect(lst.removeAt(3)).toBe("d");
    expect(lst.length).toBe(3);
    expect(lst.tail.val).toBe("c");
  });

  it("removes from 1-item list", function() {
    let lst = new LinkedList(["a"]);

    expect(lst.removeAt(0)).toBe("a");
    expect(lst.length).toBe(0);
    expect(lst.head).toBe(null);
    expect(lst.tail).toBe(null);
  });
});

describe("LL.average", function() {
  it("calculates the average of items in a list", function() {
    let lst = new LinkedList([2, 3, 1, 1, 7, 6, 9]);
    expect(lst.average()).toBeCloseTo(4.1429, 4);
  });

  it("returns 0 for empty lists", function() {
    let lst = new LinkedList();
    expect(lst.average()).toBe(0);
  });
});

describe("LL.reverse", function() { // Added
  it("reverses the items in a list", function() {
    let lst = new LinkedList([2, 3, 1, 1, 7, 6, 9]);

    lst.reverse();
    expect(lst.toArray()).toEqual([9, 6, 7, 1, 1, 3, 2]);
  });
});

describe("combineSortedLists(ll1, ll2)", function() { // Added
  it("combines two sorted lists", function() {
    let lst1 = new LinkedList([-9, -6, -3, 0, 3, 6, 9, 12]);
    let lst2 = new LinkedList([-3, -2, -1, 0, 1, 2, 3, 4, 5]);

    result = combineSortedLists(lst1, lst2, new LinkedList()).toArray();
    expect(result.length).toBe(17);
    expect(result).toEqual([-9, -6, -3, -3, -2, -1, 0, 0, 1, 2, 3, 3, 4, 5, 6, 9, 12]);
  });
});