class Boggle {
  constructor(timeLimit) {
    this.currentScore = 0;
    this.timeLimit = timeLimit;

    // When the DOM loads, start a timer to play the game (timeLimit in minutes).
    $(() => setTimeout(this.gameOver, this.timeLimit * 60*1000));
  }

  async submitGuess(word) {
    try {
      const response = await axios.get("/guess?word=" + word);
      Message.show(this.checkGuess(response.data.result, word));
    }
    catch(error) {
      Message.show("Error sending your word to the server: " + error, "error");
      console.error(error);
    }
  }

  /** Translate the API response to a user-friendly one. */
  checkGuess(result, word) {
    switch(result) {
      case "ok":
        this.updateScore(word.length);
        $("#words").show();
        $("#word-separator").show();
        $("#words-found").append(this.getWordHTML(word));
        return `Good one! ${word} is on the board.<br>You earned ${word.length} points!`;

      case "not-on-board":
        return `404: ${word} is a word but it's not on the board`;

      case "already-found":
        return `You already found ${word}`

      case "not-word":
        return `${word} is not a word`
      }
  }

  /** Generate HTML to add a word to the word list. */
  getWordHTML(word) {
    return `<li>${word} <span class="word-points">(${word.length})</span></li>`;
  }

  /** Update the score display */
  updateScore(points) {
    this.currentScore += points;
    $("#current-score").text(this.currentScore);
  }

  gameOver() {
    Message.show(`<h3>Time's up!</h3><p>Way to go!  You scored ${game.currentScore} points.</p>`);
    $("#guess-word").prop("disabled", true);
    $("#guess-form button").prop("disabled", true);
    $("#all-words").show();
    $("#all-words ul").append("<li>Getting all possible words.  This takes a while...</li>")

    // A 1ms setTimeout here will allow the above UI changes to happen before calling the API.
    setTimeout(async function() {
      try {
        const response = await axios.post("/finish", {score: game.currentScore});
        $("#best-score").text(response.data.highScore);
        $("#games-played").text(response.data.gamesPlayed);
        $("#all-words ul").empty();
        for(let word of response.data.allWords)
          $("#all-words ul").append(game.getWordHTML(word));
      }
      catch(error) {
        Message.show("Error sending your score to the server: " + error, "error");
        console.error(error);
      }
    }, 1)
  }
}

class Message {
  /** Show a message to the player */
  static show(message, severity="") {
    this.clear();
    $("#result").html(message);
    if(severity)
      $("#result").addClass(severity);
  }

  /** Clear the messages */
  static clear() {
    $("#result").empty();
    $("#result").removeClass();
  }
}

const game = new Boggle($("#gameboard").data("timeLimit"));

/** Form submission sends guesses to the server */
async function acceptGuess(e) {
  e.preventDefault();
  const word = $("#guess-word").val();
  await game.submitGuess(word);
  $("#guess-word").focus().val(""); // Reset the guess input
}

$("#guess-form").on("submit", acceptGuess);