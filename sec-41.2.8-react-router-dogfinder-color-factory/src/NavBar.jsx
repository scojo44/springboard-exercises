import React from "react"
import { NavLink } from "react-router-dom"
import './NavBar.css'

const NavBar = ({dogNames}) => {
  return (
    <nav className="NavBar">
      <NavLink to='/dogs'>Dog Finder</NavLink>
      <div>
        {dogNames.map(name => <NavLink to={'/dogs/' + name.toLowerCase()} key={name}>{name}</NavLink>)}
      </div>
    </nav>
  );
};

export default NavBar
