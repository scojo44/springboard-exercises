import React from "react";
import Pokecard from "./Pokecard";
import './Pokedex.css';

const Pokedex = ({id, pokemon = defaultPokedex, score, isWinner = false}) => {
  const winnerMessage = isWinner? <h2 className="isWinner">THIS HAND WINS!</h2> : "";
  return (
    <div className="Pokedex">
      <h1>Pokedex {id} - Score: {score}</h1>
      {winnerMessage}
      <ul>
        {pokemon.map(p => <Pokecard id={p.id} name={p.name} type={p.type} xp={p.base_experience} key={p.id} />)}
      </ul>
    </div>
  )
};

export default Pokedex;
