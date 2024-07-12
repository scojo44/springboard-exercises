import React from "react"
import './Card.css'

const Card = ({suit, rank, face, index}) => (
  <li className="Card" style={{left: 2*index + 'em'}}>
    <img src={face} alt={rank + " of " + suit} />
  </li>
)

export default Card
