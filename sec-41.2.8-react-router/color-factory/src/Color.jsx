import React from "react"
import {useParams, Navigate} from 'react-router-dom'
import './Color.css'

function ColorList({colors}) {
  const color = colors.find(c => c.name === useParams().color);

  if(!color) return <Navigate to="/colors" />;

  return (
    <h2 className="Color" style={{backgroundColor: color.value}}>
      {color.name}
    </h2>
  );
}

export default ColorList
