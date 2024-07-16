import React from "react";
import useAxios from './hooks/useAxios';
import PlayingCard from "./PlayingCard";
import "./PlayingCardList.css";

/* Renders a list of playing cards.
 * Can also add a new card at random. */
function CardTable() {
  const [cards, error, drawCard, clearCards, isLoading] = useAxios(
    'playingCards',
    'https://deckofcardsapi.com/api/deck/new/draw/',
    formatData
  );

  function formatData(resCard) {
    return {image: resCard.cards[0].image};
  }

  function handleClick() {
    if(!isLoading) drawCard();
  }

  return (
    <div className="PlayingCardList">
      <h3>Pick a card, any card!</h3>
      <div>
        <button onClick={handleClick}>Add a playing card!</button>
        <button onClick={clearCards}>Clear cards</button>
      </div>
      <div className="PlayingCardList-card-area">
        {cards.map(card => <PlayingCard key={card.id} front={card.image} />)}
        {isLoading && <PlayingCard key="LoadingCard" faceUp={false} />}
      </div>
      {error && <p>{error.name}: {error.message}</p>}
    </div>
  );
}

export default CardTable;
