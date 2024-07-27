import React from "react"
import {Link} from 'react-router-dom'

const ColorList = ({colors}) => {
  return (
    <div className="ColorList">
      <p><Link to="new">Add a new color</Link></p>
      <menu>
        {colors.map(c => <li key={c.id}><Link to={c.name}>{c.name}</Link></li>)}
      </menu>
    </div>
  );
};

export default ColorList
