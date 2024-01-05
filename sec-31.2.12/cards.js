/** Part 2: Deck of Cards */
const CARDS_API_URL = "https://deckofcardsapi.com/api/deck";

// 1. Make a request to the Deck of Cards API to request a single card from a newly shuffled deck.
axios.get(`${CARDS_API_URL}/new/shuffle/?deck_count=1&jokers_enabled=true`)
  .then(res => {
    const deckID = res.data.deck_id;
    console.log("New shuffled deck of cards: #" + deckID);
    return axios.get(`${CARDS_API_URL}/${deckID}/draw/?count=1`);
  })
  .then(res => {
    const card = res.data.cards[0];
    const out = new OutPut("draw-card");
    out.append(`Drew a card: ${card.value} of ${card.suit}`);
  })
  .catch(error => console.log("1. Error drawing a card: ", error.response?.data?.error || error.response?.data || error));

// 2. Request a single card from a newly shuffled deck.
// Once you have the card, request one more card from the same deck.
const hand = [];
let deckID;

axios.get(`${CARDS_API_URL}/new/shuffle/?deck_count=1&jokers_enabled=true`)
  .then(res => {
    deckID = res.data.deck_id;
    console.log("New shuffled deck of cards: #" + deckID)
    return axios.get(`${CARDS_API_URL}/${deckID}/draw/?count=1`);
  })
  .then(res => {
    const card = res.data.cards[0];
    hand.push(card);
    return axios.get(`${CARDS_API_URL}/${deckID}/draw/?count=1`);
  })
  .then(res => {
    const card = res.data.cards[0];
    hand.push(card);
    const out = new OutPut("draw-two-cards");
    out.appendLine("Here's my cards:")
    for(let card of hand)
      out.appendLine(`${card.value} of ${card.suit}`);
  })
  .catch(error => console.log("2. Error drawing two cards: ", error.response?.data?.error || error.response?.data || error));

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

  shuffle(){
    this.shufflePromise = axios.get(`${this.API_URL}/new/shuffle/?deck_count=${this.deckCount}&jokers_enabled=${this.hasJokers}`)
      .then(res => {
        this.setDeckID(res.data.deck_id);
        this.setCardsLeft(res.data.remaining);
        console.log("3. New shuffled deck of cards: #" + this.getDeckID);
      })
      .catch(error => console.log("3. Error getting a new deck of cards: ", error.response?.data || error));
  }

  draw(count = 1){
    if(!this.getCardsLeft())
      return false;

    return axios.get(`${this.API_URL}/${this.getDeckID()}/draw/?count=${count}`)
    .then(res => {
      this.setCardsLeft(res.data.remaining);
      return res.data.cards;
    })
    .catch(error => {
      console.log("3. Error drawing a card: ", error.response?.data?.error || error)
      return [false]; // An array will be expected.
    });
  }
}

const theDeck = new DeckOfCards();
const drawButton = document.getElementById("draw-card-button");
const discard = document.getElementById("discard-pile");
const cardsLeft = document.getElementById("cards-left");
cardsLeft.innerText = theDeck.getCardsLeft();

drawButton.addEventListener("click", e => {
  theDeck.draw().then(cards => {
    const [myCard] = cards;
    img = document.createElement("img");
    img.src = myCard.image;
    discard.append(img);
    cardsLeft.innerText = theDeck.getCardsLeft();
    if(!theDeck.getCardsLeft())
      drawButton.disabled = true;
  });
});