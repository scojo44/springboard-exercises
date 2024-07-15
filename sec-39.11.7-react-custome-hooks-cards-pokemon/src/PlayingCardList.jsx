import React from "react";
import useAxios from './hooks/useAxios';
import PlayingCard from "./PlayingCard";
import "./PlayingCardList.css";

/* Renders a list of playing cards.
 * Can also add a new card at random. */
function CardTable() {
  let [cards, error, drawCard, isLoading] = useAxios("https://deckofcardsapi.com/api/deck/new/draw/");

  function handleClick() {
    if(!isLoading) drawCard();
  }

  return (
    <div className="PlayingCardList">
      <h3>Pick a card, any card!</h3>
      <div>
        <button onClick={handleClick}>Add a playing card!</button>
      </div>
      <div className="PlayingCardList-card-area">
        {cards.map(card => (
          <PlayingCard key={card.id} front={card.cards[0].image} />
        ))}
        {isLoading && <PlayingCard key="LoadingCard" faceUp={false} />}
      </div>
      {error && <p>{error.name}: {error.message}</p>}
    </div>
  );
}

export default CardTable;
