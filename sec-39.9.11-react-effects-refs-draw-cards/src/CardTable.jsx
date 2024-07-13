import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Alert from './Alert'
import Card from './Card'
import './CardTable.css'

const CARDS_API_URL = "https://deckofcardsapi.com/api/deck";

function CardTable() {
  const deck = useRef(null);
  const drawIntervalID = useRef(null);
  const [hand, setHand] = useState([]);
  const [shuffling, setShuffling] = useState(false);
  const [drawing, setDrawing] = useState(false);

  useEffect(function getNewDeck() {
    axios.get(`${CARDS_API_URL}/new/shuffle/?deck_count=1&jokers_enabled=true`).then(res => {
      deck.current = res.data;
    })
    .catch(e => {
      console.error(e);
    });
  }, []);

  useEffect(function startDrawing() {
    if(drawing) {
      drawIntervalID.current = setInterval(drawCard, 1000);
    }

    return function stopDrawing() {
      clearInterval(drawIntervalID.current);
      drawIntervalID.current = null;
    }
  }, [drawing]);

  return (
    <div className='CardTable'>
      <p>
        <button onClick={drawClicked} disabled={deck.current?.remaining === 0}>Draw One Card</button>
        <button onClick={drawStartStopClicked} disabled={!drawing && deck.current?.remaining === 0}>{drawing? 'Stop' : 'Start'} Drawing Cards</button>
        <button onClick={shuffleClicked} disabled={shuffling || hand.length === 0}>Shuffle</button>
      </p>
      <ul>
        {hand.map((card, i) => <Card suit={card.suit} rank={card.value} face={card.image} index={i} key={card.code} />)}
      </ul>
      {deck.current?.remaining == 0 && <Alert category="error" message="No more cards left to draw!" />}
    </div>
  )

  /** Shuffle the deck when the shuffle state flag is true */
  async function shuffleDeck() {
    try {
      setShuffling(true);
      const res = await axios.get(`${CARDS_API_URL}/${deck.current.deck_id}/shuffle/`);
      deck.current = res.data;
      setHand([]);
      setDrawing(false);
    }
    catch(e) {
      console.error(e);
    }
    finally {
      setShuffling(false);
    }
  }

  /** Draw a card */
  async function drawCard() {
    // Skip if out of cards
    if(deck.current.remaining === 0) {
      setDrawing(false);
      return
    }

    // Draw a new card from the deck
    try {
      const res = await axios.get(`${CARDS_API_URL}/${deck.current.deck_id}/draw/?count=1`);
      deck.current.remaining = res.data.remaining;
      setHand((hand) => [...hand, ...res.data.cards]);
    }
    catch(e) {
      setDrawing(false);
      console.error(e);
    }
  }

  /** Clear the drawn cards and trigger a reshuffling of the deck */
  async function shuffleClicked(e) {
    await shuffleDeck();
  }

  /** Draw a card */
  async function drawClicked(e) {
    await drawCard(1);
  }

  /** Start or stop drawing cards on a timer */
  function drawStartStopClicked(e) {
    setDrawing(() => !drawing);
  }
}

export default CardTable
