import React, { useState } from "react";
import Light from "./Light";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - rows: number of rows of board
 * - cols: number of cols of board
 * - chanceLightStartsOn: float, chance any light is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Light /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual lights
 *
 **/

function Board({rows = 5, cols = 5, chanceLightStartsOn = .5}) {
  const [board, setBoard] = useState(createBoard());

  /** create a board with the given number of rows and cols, each light randomly lit or unlit */
  function createBoard() {
    function lightRandomly() {
      return Math.random() < chanceLightStartsOn;
    }

    const initialBoard = Array.from({length: cols});
    // TODO: create array-of-arrays of true/false values
    return initialBoard.map(row => Array.from({length: cols}).map(col => lightRandomly()));
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    return board.reduce((isBoardOff,nextRow) => {
      return isBoardOff && nextRow.reduce((isRowOff,nextLight) => {
        return isRowOff && !nextLight;
      }, true);
    }, true);
  }

  function flipLightsAround(x,y) {
    setBoard(oldBoard => {
      const flipLight = (y, x, boardCopy) => {
        // if this coord is actually on the board, flip it
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      const newBoard = oldBoard.map(row => [...row]);

      // TODO: in the copy, flip this light and the lights around it
      flipLight(y,   x, newBoard);
      flipLight(y+1, x, newBoard);
      flipLight(y, x+1, newBoard);
      flipLight(y-1, x, newBoard);
      flipLight(y, x-1, newBoard);

      // TODO: return the copy
      return newBoard;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  return hasWon()
    ? <h2 className="Board">You Won!</h2>
    : (
      // make table board
      <table className="Board">
        <tbody>
          {board.map((row,y) => 
            <tr key={y}>
              {row.map((isLit,x) => <Light key={[x,y]} isLit={isLit} flipLightsAroundMe={e => flipLightsAround(x,y)} />)}
            </tr>
          )}
        </tbody>
      </table>
    )
}

// This method of defaultProps will be gone in React 19
// Board.defaultprops = {
//   rows: 5,
//   cols: 5,
//   chanceLightStartsOn: .5
// };

export default Board;
