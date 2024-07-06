import React, {useState} from "react";
import './ColorBox.css';

const ColorBox = ({color}) => {
  return <div className="ColorBox" style={{backgroundColor: color}}></div>;
};

export default ColorBox;
