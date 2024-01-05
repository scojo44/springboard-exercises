/** Part 2: Deck of Cards */
const CARDS_API_URL = "https://deckofcardsapi.com/api/deck";

// 1. Make a request to the Deck of Cards API to request a single card from a newly shuffled deck.
async function getOneCard() {
  let deckID;

  try {
    // Get a new shuffled deck
    const res = await axios.get(`${CARDS_API_URL}/new/shuffle/?deck_count=1&jokers_enabled=true`)
    deckID = res.data.deck_id;
    console.log("1. New shuffled deck of cards: #" + deckID);
  }
  catch(error) {
    console.log("1. Error getting a new deck of cards: ", error.response?.data || error);
    return;
  }

  try {
    // Draw one card
    const res = await axios.get(`${CARDS_API_URL}/${deckID}/draw/?count=1`);
    const card = res.data.cards[0];
    const out = new OutPut("draw-card");
    out.append(`1. Drew a card: ${card.value} of ${card.suit}`);
  }
  catch(error) {
    console.log("1. Error drawing a card: ", error.response?.data?.error || error);
  }
}
getOneCard();

// 2. Request a single card from a newly shuffled deck.
// Once you have the card, request one more card from the same deck.
async function getTwoCards() {
  let deckID;

  try {
    // Get a new shuffled deck
    const res = await axios.get(`${CARDS_API_URL}/new/shuffle/?deck_count=1&jokers_enabled=true`);
    deckID = res.data.deck_id;
    console.log("2. New shuffled deck of cards: #" + deckID)
  }
  catch(error) {
    console.log("2. Error getting a new deck of cards: ", error.response?.data || error);
    return;
  }

  // Draw two cards
  const hand = [];
  try {
    const res2 = await axios.get(`${CARDS_API_URL}/${deckID}/draw/?count=1`);
    const res3 = await axios.get(`${CARDS_API_URL}/${deckID}/draw/?count=1`);
    const card2 = res2.data.cards[0];
    const card3 = res3.data.cards[0];
    hand.push(card2);
    hand.push(card3);
  }
  catch(error) {
    console.log("2. Error drawing two cards: ", error.response?.data?.error || error);
    return;
  }

  // Display the cards
  const out = new OutPut("draw-two-cards");
  out.appendLine("Here's my cards:")
  for(let card of hand)
    out.appendLine(`${card.value} of ${card.suit}`);
}
getTwoCards();

// 3. Build an HTML page that lets you draw cards from a deck.
class DeckOfCards {
  constructor(deckCount = 1, withJokers = true){
    this.API_URL = "https://deckofcardsapi.com/api/deck";
    this.deckCount = deckCount;
    this.hasJokers = withJokers;

    if(this.getDeckID())
      console.log("3. Using existing deck of cards: #" + this.getDeckID);
    else
      this.shuffle();
  }

  getDeckID = () => localStorage["deckID"];
  setDeckID = id => localStorage["deckID"] = id;
  getCardsLeft = () => localStorage["cardsLeft"];
  setCardsLeft = cl => localStorage["cardsLeft"] = cl;

  async shuffle(){
    try {
      const res = await axios.get(`${this.API_URL}/new/shuffle/?deck_count=${this.deckCount}&jokers_enabled=${this.hasJokers}`);
      this.setDeckID(res.data.deck_id);
      this.setCardsLeft(res.data.remaining);
      console.log("3. New shuffled deck of cards: #" + this.getDeckID);
    }
    catch(error) {
      console.log("3. Error getting a new deck of cards: ", error.response?.data || error);
    }
  }

  async draw(count = 1){
    if(!this.getCardsLeft())
      return false;

    try {
      const res = await axios.get(`${this.API_URL}/${this.getDeckID()}/draw/?count=${count}`);
      this.setCardsLeft(res.data.remaining);
      return res.data.cards;
    }
    catch(error) {
      console.log("3. Error drawing a card: ", error.response?.data?.error || error);
      return [false]; // An array will be expected.
    }
  }
}

const theDeck = new DeckOfCards();
const drawButton = document.getElementById("draw-card-button");
const discard = document.getElementById("discard-pile");
const cardsLeft = document.getElementById("cards-left");
cardsLeft.innerText = theDeck.getCardsLeft();

drawButton.addEventListener("click", async e => {
  const [myCard] = await theDeck.draw();

  if(!myCard)
    return;

  img = document.createElement("img");
  img.src = myCard.image;
  discard.append(img);
  cardsLeft.innerText = theDeck.getCardsLeft();
  if(!theDeck.getCardsLeft())
    drawButton.disabled = true;
});