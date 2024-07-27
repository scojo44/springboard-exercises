import React from "react"
import {Link} from 'react-router-dom'
import './ColorList.css'

const ColorList = ({colors}) => {
  return (
    <div className="ColorList">
      <h2>Saved Colors</h2>
      <menu>
        {colors.map(c => <li key={c.id}><Link to={c.name}>{c.name}</Link></li>)}
      </menu>
      <p><Link to="new">Add a new color</Link></p>
    </div>
  );
};

export default ColorList
