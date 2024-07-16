import React, { useState } from "react";
import useAxios from './hooks/useAxios';
import PokemonSelect from "./PokemonSelect";
import PokemonCard from "./PokemonCard";
import "./PokeDex.css";

/* Renders a list of pokemon cards.
 * Can also add a new card at random,
 * or from a dropdown of available pokemon. */
function PokeDex() {
  let [cards, error, drawCard, isLoading] = useAxios('https://pokeapi.co/api/v2/pokemon/');

  function addPokemon(name) {
    if(!isLoading) drawCard(name);
  }

  return (
    <div className="PokeDex">
      <div className="PokeDex-buttons">
        <h3>Please select your pokemon:</h3>
        <PokemonSelect add={addPokemon} />
      </div>
      <div className="PokeDex-card-area">
        {cards.map(cardData => (
          <PokemonCard
            key={cardData.id}
            front={cardData.sprites.front_default}
            back={cardData.sprites.back_default}
            name={cardData.name}
            stats={cardData.stats.map(stat => ({
              value: stat.base_stat,
              name: stat.stat.name
            }))}
          />
        ))}
        {isLoading && (
          <div className="PokemonCard Card">
            <h2>Catching<br />Pokemon...</h2>
          </div>
        )}
      </div>
      {error && <p>{error.name}: {error.message}</p>}
    </div>
  );
}

export default PokeDex;
