import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Alert from './Alert'
import Card from './Card'
import './CardTable.css'

const CARDS_API_URL = "https://deckofcardsapi.com/api/deck";

function CardTable() {
  useEffect(function createDeck() {
    axios.get(`${CARDS_API_URL}/new/shuffle/?deck_count=1&jokers_enabled=true`).then(res => {
      deck.current = res.data;
    })
    .catch(e => {
      console.error(e);
    });
  }, []);

  function handleClick(e) {
    if(deck.current.remaining === 0) {
      setAlert(() => ({
        message: 'No more cards left to draw!',
        category: 'error'
      }));
      return
    }
    // Draw a new card from the deck
    axios.get(`${CARDS_API_URL}/${deck.current.deck_id}/draw/?count=1`).then(res => {
      setCards(() => [...hand, ...res.data.cards]);
      deck.current.remaining = res.data.remaining;
    })
    .catch(e => {
      console.error(e);
    });
  }

  const deck = useRef();
  const [hand, setCards] = useState([]);
  const [alert, setAlert] = useState(null);

  return (
    <div className='CardTable'>
      <button onClick={handleClick}>Draw!</button>
      <ul>
        {hand.map((card, i) => <Card suit={card.suit} rank={card.value} face={card.image} index={i} key={card.code} />)}
      </ul>
      {alert && <Alert category={alert.category} message={alert.message} />}
    </div>
  )
}

export default CardTable
