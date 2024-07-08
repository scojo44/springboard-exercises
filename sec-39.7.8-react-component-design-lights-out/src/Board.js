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

function Board({ rows, cols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board with the given number of rows and cols, each light randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // TODO: create array-of-arrays of true/false values
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
  }

  function flipLightsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipLight = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard

      // TODO: in the copy, flip this light and the lights around it

      // TODO: return the copy
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  // TODO

  // make table board

  // TODO
}

export default Board;
