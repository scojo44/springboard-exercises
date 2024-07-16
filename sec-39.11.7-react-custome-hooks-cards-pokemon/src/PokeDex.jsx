import React, { useState } from "react";
import useAxios from './hooks/useAxios';
import PokemonSelect from "./PokemonSelect";
import PokemonCard from "./PokemonCard";
import "./PokeDex.css";

/* Renders a list of pokemon cards.
 * Can also add a new card at random,
 * or from a dropdown of available pokemon. */
function PokeDex() {
  const [cards, error, drawCard, clearCards, isLoading] = useAxios(
    'pokemon',
    'https://pokeapi.co/api/v2/pokemon/',
    formatData
  );

  function formatData(resPokemon) {
    return {
      front: resPokemon.sprites.front_default,
      back: resPokemon.sprites.back_default,
      name: resPokemon.name,
      stats: resPokemon.stats.map(stat => ({
        value: stat.base_stat,
        name: stat.stat.name
      }))
    };
  }

  function addPokemon(name) {
    if(!isLoading) drawCard(name);
  }

  return (
    <div className="PokeDex">
      <div className="PokeDex-buttons">
        <h3>Please select your pokemon:</h3>
        <PokemonSelect add={addPokemon} clear={clearCards} />
      </div>
      <div className="PokeDex-card-area">
        {cards.map(p => <PokemonCard key={p.id} front={p.front} back={p.back} name={p.name} stats={p.stats} />)}
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
