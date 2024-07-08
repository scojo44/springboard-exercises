import React from "react";
import "./Light.css";

/** A single light on the board.
 *
 * This has no state --- just two props:
 *
 * - flipLightsAroundMe: a function received from the board which flips this
 *      light and the lights around it
 *
 * - isLit: boolean, is this Light lit?
 *
 * This handles clicks --- by calling flipLightsAroundMe
 *
 **/

function Light({ isLit, flipLightsAroundMe }) {
  const classes = `Light ${isLit ? "Light-lit" : ""}`;
  return <td className={classes} onClick={flipLightsAroundMe} />;
}

export default Light;
