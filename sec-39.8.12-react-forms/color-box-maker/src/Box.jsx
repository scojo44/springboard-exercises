import React from "react";
import './Box.css';

const Box = ({id, width, height, color, removeMe}) => {
  function handleClick(e) {
    removeMe(id);
  }

  return (
    <li className="Box">
      <div style={{width, height, backgroundColor: color}}></div>
      <p><button onClick={handleClick} className="x-btn">X</button></p>
    </li>
  )
};

export default Box;
