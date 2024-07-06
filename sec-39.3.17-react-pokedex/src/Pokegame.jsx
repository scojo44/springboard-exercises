import React from "react";
import Pokedex from "./Pokedex";

// defaultProps on component functions is deprecated in favor of JS default argument values
const pokemonDB = [
  {id: 4, name: 'Charmander', type: 'fire', base_experience: 62},
  {id: 7, name: 'Squirtle', type: 'water', base_experience: 63},
  {id: 11, name: 'Metapod', type: 'bug', base_experience: 72},
  {id: 12, name: 'Butterfree', type: 'flying', base_experience: 178},
  {id: 25, name: 'Pikachu', type: 'electric', base_experience: 112},
  {id: 39, name: 'Jigglypuff', type: 'normal', base_experience: 95},
  {id: 94, name: 'Gengar', type: 'poison', base_experience: 225},
  {id: 133, name: 'Eevee', type: 'normal', base_experience: 65}
];

const Pokegame = ({pokemon = pokemonDB}) => {
  let ticketJar = []; // Indexes of the pokemon array
  const pokedexA = [];
  const pokedexB = [];

  // Have each pokemon take a numbered ticket from the jar
  pokemon.map((p,i) => ticketJar.push(i));

  // Form two random pokedexes
  while(ticketJar.length > 0){
    // Draw a number from the ticket jar
    const ticketIndex = Math.floor(Math.random() * ticketJar.length);
    const ticketNumber = ticketJar[ticketIndex];
    // Have the pokemon holding the ticket with that number step forward
    const chosen = pokemon[ticketNumber];
    // Remove that ticket from the jar
    ticketJar.splice(ticketIndex, 1);

    // Assign the chosen pokemon to a team (teams take turns getting one).
    if(pokedexA.length === pokedexB.length)
      pokedexA.push(chosen);
    else
      pokedexB.push(chosen);
  }

  const scoreA = pokedexA.reduce((sum, next) => sum += next.base_experience, 0);
  const scoreB = pokedexB.reduce((sum, next) => sum += next.base_experience, 0);

  return (
    <div className="Pokegame">
      <Pokedex key='A' id="A" pokemon={pokedexA} score={scoreA} isWinner={scoreA > scoreB}/>
      <Pokedex key='B' id="B" pokemon={pokedexB} score={scoreB} isWinner={scoreB > scoreA}/>
    </div>
  )
};

export default Pokegame