import React from "react"
import {useParams, Navigate} from 'react-router-dom'

function ColorList({colors}) {
  const color = colors.find(c => c.name === useParams().color);

  if(!color) return <Navigate to="/colors" />;

  return (
    <p className="Color" style={{backgroundColor: color.value}}>
      {color.name}
    </p>
  );
}

export default ColorList
