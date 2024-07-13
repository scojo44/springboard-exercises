/** TreeNode: node for a general tree. */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }

  /** sumValues(): add up all of the values in the tree. */

  sumValues() {
    if(!this.root) return 0; // Edge case: Empty tree

    const stack = [this.root];
    let sum = 0;

    while(stack.length) {
      const current = stack.pop();
      sum += current.val;
      current.children.forEach(n => {
        stack.push(n);
      });
    }

    return sum
  }

  /** countEvens(): count all of the nodes in the tree with even values. */

  countEvens() {
    if(!this.root) return 0; // Edge case: Empty tree

    const stack = [this.root];
    let count = 0;

    while(stack.length) {
      const current = stack.pop();
      count += current.val % 2 === 0? 1 : 0;
      current.children.forEach(n => {
        stack.push(n);
      });
    }

    return count
  }

  /** numGreater(lowerBound): return a count of the number of nodes
   * whose value is greater than lowerBound. */

  numGreater(lowerBound) {
    if(!this.root) return 0; // Edge case: Empty tree

    const stack = [this.root];
    let count = 0;

    while(stack.length) {
      const current = stack.pop();
      count += current.val > lowerBound? 1 : 0;
      current.children.forEach(n => {
        stack.push(n);
      });
    }

    return count
  }
}

module.exports = { Tree, TreeNode };
