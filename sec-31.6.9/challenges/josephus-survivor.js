// Get the CircularArray class from an earlier exercise.
const CircularLinkedList = require("../../sec-25.5.12/circular-linked-list");

function findSurvivor(total, skip) {
  const list = new CircularLinkedList();

  for(let i = 1; i <= total; i++)
    list.push(i);

  let current = list.head;
  let count = 1;

  while(current.next && list.length > 1) {
    if(count++ === skip) {
      list.remove(current);
      count = 1;
    }

    current = current.next;
  }

  return list.head.val;
}

console.log("findSurvivor(10, 3)", findSurvivor(10, 3));
console.log("findSurvivor(10, 12)", findSurvivor(10, 12));
console.log("findSurvivor(87, 35)", findSurvivor(87, 35));