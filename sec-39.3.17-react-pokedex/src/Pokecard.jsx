import React from 'react';
import './Pokecard.css';

const Pokecard = ({id, name, type, xp}) => {
  const imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <li className="Pokecard">
      <h3>{name}</h3>
      <img src={imageURL} />
      <p>
        Type: {type}
        <br />EXP: {xp}
      </p>
    </li>
  )
};

export default Pokecard;
