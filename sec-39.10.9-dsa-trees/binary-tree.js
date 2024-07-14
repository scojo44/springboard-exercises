/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth(node = this.root, levels = 0) {
    if(!node) return 0; // Edge case: Empty tree

    levels++;
    const isLeaf = node.left === null && node.right === null;
    return isLeaf? levels : Math.min(this.minDepth(node.left, levels), this.minDepth(node.right, levels));
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth(node = this.root, levels = 0) {
    if(!node) return 0; // Edge case: Empty tree

    levels++;
    const isLeaf = node.left === null && node.right === null;
    return isLeaf? levels : Math.max(this.maxDepth(node.left, levels), this.maxDepth(node.right, levels));
  } 

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  maxSum() {
    if(!this.root) return 0; // Edge case: Empty tree

    return this.maxSumLeaf(this.root.left) + this.root.val + this.maxSumLeaf(this.root.right);
  }

  maxSumLeaf(node = this.root, sum = 0) {
    if(!node) return 0; // Edge case: Empty tree

    const childSum = Math.max(this.maxSumLeaf(node.left), this.maxSumLeaf(node.right));
    return sum + node.val + childSum;
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    if(!this.root) return null; // Edge case: Empty tree

    const stack = [this.root];
    let closest = null;

    while(stack.length) {
      const current = stack.pop();

      // Check if node's value is more than the passed value
      if(current.val > lowerBound)
        closest = Math.min(current.val, closest || Number.MAX_VALUE); // Convert from null

      if(current.left) stack.push(current.left);
      if(current.right) stack.push(current.right);
    }

    return closest;
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {

  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize() {

  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize() {

  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
