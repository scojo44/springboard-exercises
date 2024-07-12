import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Alert from './Alert'
import Card from './Card'
import './CardTable.css'

const CARDS_API_URL = "https://deckofcardsapi.com/api/deck";

function CardTable() {
  const deck = useRef();
  const [hand, setHand] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(function getNewDeck() {
    axios.get(`${CARDS_API_URL}/new/shuffle/?deck_count=1&jokers_enabled=true`).then(res => {
      deck.current = res.data;
    })
    .catch(e => {
      console.error(e);
    });
  }, []);

  /** Shuffle the deck when the shuffle state flag is true */
  useEffect(function shuffleDeck() {
    if(!shuffle) return

    axios.get(`${CARDS_API_URL}/${deck.current.deck_id}/shuffle/`).then(res => {
      deck.current = res.data;
      setShuffle(false);
      setAlert({})
    })
    .catch(e => {
      console.error(e);
    });
  }, [shuffle]);

  return (
    <div className='CardTable'>
      <p>
        <button onClick={drawClicked} disabled={deck.current.remaining === 0}>Draw</button>
        <button onClick={shuffleClicked} disabled={hand.length === 0}>Shuffle</button>
      </p>
      <ul>
        {hand.map((card, i) => <Card suit={card.suit} rank={card.value} face={card.image} index={i} key={card.code} />)}
      </ul>
      {alert && <Alert category={alert.category} message={alert.message} />}
    </div>
  )

  /** Clear the drawn cards and trigger a reshuffling of the deck */
  function shuffleClicked(e) {
    setHand([]);
    setShuffle(true);
  }

  /** Draw a card */
  function drawClicked(e) {
    if(deck.current.remaining === 0) {
      setAlert(() => ({
        message: 'No more cards left to draw!',
        category: 'error'
      }));
      return
    }
    // Draw a new card from the deck
    axios.get(`${CARDS_API_URL}/${deck.current.deck_id}/draw/?count=1`).then(res => {
      setHand(() => [...hand, ...res.data.cards]);
      deck.current.remaining = res.data.remaining;
    })
    .catch(e => {
      console.error(e);
    });
  }
}

export default CardTable
