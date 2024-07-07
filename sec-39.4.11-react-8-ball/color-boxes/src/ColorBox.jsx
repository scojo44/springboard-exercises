import React, {useState} from "react";
import './ColorBox.css';

const ColorBox = ({color, message=''}) => {
  return <div className="ColorBox" style={{backgroundColor: color}}>{message}</div>;
};

export default ColorBox;
