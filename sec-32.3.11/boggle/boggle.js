/** Boggle word check.

Given a 5x5 boggle board, see if you can find a given word in it.

In Boggle, you can start with any letter, then move in any NEWS direction.
You can continue to change directions, but you cannot use the exact same
tile twice.

So, for example::

    N C A N E
    O U I O P
    Z Q Z O N
    F A D P L
    E D E A Z

In this grid, you could find `NOON* (start at the `N` in the top
row, head south, and turn east in the third row). You cannot find
the word `CANON` --- while you can find `CANO` by starting at the
top-left `C`, you can 't re-use the exact same `N` tile on the
front row, and there's no other `N` you can reach.

*/

function makeBoard(boardString) {
  /** Make a board from a string.

    For example::

        board = makeBoard(`N C A N E
                           O U I O P
                           Z Q Z O N
                           F A D P L
                           E D E A Z`);

        board.length   // 5
        board[0]       // ['N', 'C', 'A', 'N', 'E']
    */

  const letters = boardString.split(/\s+/);

  const board = [
    letters.slice(0, 5),
    letters.slice(5, 10),
    letters.slice(10, 15),
    letters.slice(15, 20),
    letters.slice(20, 25),
  ];

  return board;
}

function findNext(board, word, y, x, i = 0, locations = new Set()) {
  // Base case - Past the end of the word
  if(i >= word.length)  return true;

  // Base case - x,y is out of bounds
  if(y < 0 || y >= board.length)  return false;
  if(x < 0 || x >= board[0].length)  return false;

  // Base case - Skip the letter we just came from
  if(locations.has(y + ',' + x))  return false;
  
  // Base case - Next letter is not here
  if(board[y][x] !== word[i])  return false;
  
  // Normal case
  locations = new Set(locations); // Give each recursion path has its own breadcrumb trail
  locations.add(y + ',' + x);

  if(findNext(board, word, y, x+1, i+1, locations)) return true;
  if(findNext(board, word, y, x-1, i+1, locations)) return true;
  if(findNext(board, word, y+1, x, i+1, locations)) return true;
  if(findNext(board, word, y-1, x, i+1, locations)) return true;

  return false; // Reached a dead-end
}

function find(board, word) {  /** Can word be found in board? */
  // Loop through all the letters and recursively check each path for the word
  for(let y = 0; y < board.length; y++)
    for(let x = 0; x < board[y].length; x++)
      if(findNext(board, word, y, x)) return "Found It!";

  return "404...";  // All possible paths are a dead-end
}

/* EXAMPLE TEST
 *********************************/


// For example::

const board = makeBoard(`N C A N E
                         O U I O P
                         Z Q Z O N
                         F A D P L
                         E D E A Z`);

// `NOON` should be found (0, 3) -> (1, 3) -> (2, 3) -> (2, 4)::

console.log("NOON is on the board:", find(board, "NOON"));

// `NOPE` should be found (0, 3) -> (1, 3) -> (1, 4) -> (0, 4)::

console.log("NOPE is on the board:", find(board, "NOPE"));

// `CANON` can't be found (`CANO` starts at (0, 1) but can't find
// the last `N` and can't re-use the N)::

console.log("CANON is not on the board:", find(board, "CANON"));

// You cannot travel diagonally in one move, which would be required
// to find `QUINE`::

console.log("QUINE is not on the board:", find(board, "QUINE"));

// We can recover if we start going down a false path (start 3, 0)::

console.log("FADED is on the board:", find(board, "FADED"));

// An extra tricky case --- it needs to find the `N` toward the top right,
// and then go down, left, up, up, right to find all four `O`s and the `S`::

const board2 = makeBoard(`E D O S Z
                          N S O N R
                          O U O O P
                          Z Q Z O R
                          F A D P L`);

console.log("NOOOOS is on the board:", find(board2, "NOOOOS"));
