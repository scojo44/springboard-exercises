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

  /** Generate an array of tree nodes
   * node: Root node to start with and a left or right node in recursive calls
   * sum: The recursively collected total of the best path found
   */
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

  /** Find the first node with the value, depth-first */

  findDFS(val) {
    if(!this.root) return null; // Edge case: Empty tree

    const stack = [this.root];

    while(stack.length) {
      const current = stack.pop();

      if(current.val === val) // Found it!
        return current;

      if(current.left) stack.push(current.left);
      if(current.right) stack.push(current.right);
    }

    return null;
  }

  /** Find the first node with the value, breadth or highest-ranked first */

  findBFS(val) {
    if(!this.root) return null; // Edge case: Empty tree

    const queue = [this.root];

    while(queue.length) {
      const current = queue.shift();

      if(current.val === val) // Found it!
        return current;

      if(current.left) queue.push(current.left);
      if(current.right) queue.push(current.right);
    }

    return null;
  }

  /** Find the node's parent */

  getParent(node) {
    if(!this.root) return null; // Edge case: Empty tree
    if(node === this.root) return null; // Edge case: Node is root and has no parent

    const stack = [this.root];

    while(stack.length) {
      const current = stack.pop();

      if(current.left === node || current.right === node) // Found it!
        return current;

      if(current.left) stack.push(current.left);
      if(current.right) stack.push(current.right);
    }

    return null;
  }

  /** Find the node's ancestors */

  getAncestors(node) {
    if(!this.root) return []; // Edge case: Empty tree
    if(node === this.root) return []; // Edge case: Node is root and has no ancestors

    const ancestors = [];
    let current = node;

    // Walk upwards collecting the ancestors with root as the first element
    while(current) {
      const parent = this.getParent(current);

      if(parent)
        ancestors.unshift(parent);

      current = parent;
    }

    return ancestors;
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {
    // Either one is not in the tree
    if(!this.findDFS(node1.val) || !this.findDFS(node2.val)) return false;

    let parent1 = this.getParent(node1);
    let parent2 = this.getParent(node2);

    // Same parent: Siblings, not cousins
    if(parent1 === parent2) return false;

    while(parent1 !== null && parent2 !== null) {
      if(this.getParent(parent1) === this.getParent(parent2)) return true;
      parent1 = this.getParent(parent1);
      parent2 = this.getParent(parent2);
    }

    return false;
  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize(tree) {
    const nodes = BinaryTree.toArray(tree.root, [tree.root.val]);

    // Trim extra 'null' entries at the end of the array
    while(nodes[nodes.length-1] == 'null')
      nodes.pop();

    return nodes.toString();
  }
  
  /** Generate an array of tree nodes
   * node: Root node to start with and a left or right node in recursive calls
   * serialized: The root node's value in an array and the serialized progress in recursive calls
   */
  static toArray(node, serialized = []) {
    if(!node) return;

    // The first element in serialized is the root's value
    // Now scan the rest and add the remaining node values via the left and right nodes.
    serialized.push(node.left? node.left.val : 'null');
    serialized.push(node.right? node.right.val : 'null');
    BinaryTree.toArray(node.left, serialized);
    BinaryTree.toArray(node.right, serialized);
    return serialized;
  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize(serialized) {
    if(serialized === '') return new BinaryTree(); // Edge case: Empty tree

    const nodes = serialized.split(',').map(n => n === 'null'? null : new BinaryTreeNode(+n))

    for(let i = 0; i < nodes.length; i++) {
      if(nodes[2*i+1]) nodes[i].left = nodes[2*i+1];
      if(nodes[2*i+2]) nodes[i].right = nodes[2*i+2];
    }

    const tree = new BinaryTree(nodes[0]);
    return tree;
  }
 

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    // Get an array of each node's ancestors, root first, self last
    const ancestors1 = [...this.getAncestors(node1), node1];
    const ancestors2 = [...this.getAncestors(node2), node2];
    let lca;

    for(let i = 0; i < Math.min(ancestors1.length, ancestors2.length); i++) {
      if(ancestors1[i] === ancestors2[i])
        lca = ancestors1[i];
      else
        break;
    }

    return lca;
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
