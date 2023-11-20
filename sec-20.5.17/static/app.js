class Boggle {
  constructor() {
    this.currentScore = 0;
    $("#guess-form").on("submit", this.acceptGuess);

    // Start a 60-second timer to play the game
    this.timer = () => setTimeout(async () => {
      await this.gameOver();
    }, 60000);

    // Start the timer with the DOM finishes loading
    $(this.timer)
  }

  /** Form submission sends guesses to the server */
  async acceptGuess(e) {
    e.preventDefault();
    const word = $("#guess-word").val();
    const $result = $("#result");
    $result.empty();
    $result.removeClass("error");
    $("#guess-word").focus().val(""); // Reset the guess input

    try {
      const response = await axios.get("/guess?word=" + word);
      $result.html(checkGuess(response.data.result, word));
    }
    catch(error) {
      $result.innerHTML = "Error sending your word to the server: " + error;
      $result.addClass("error");
      console.error(error);
    }
  }

  /** Translate the API response to a user-friendly one. */
  checkGuess(result, word) {
    switch(result) {
      case "ok":
        updateScore(word.length);
        $("#words-found").prepend(`<li>${word} (${word.length})</li>`);
        return `Good one! ${word} is on the board.<br>You earned ${word.length} points!`;

      case "not-on-board":
        return `404: ${word} is a word but it's not on the board`;

      case "already-found":
        return `You already found ${word}`

      case "not-word":
        return `${word} is not a word`
      }
  }

  /** Update the score display */
  updateScore(points) {
    this.currentScore += points;
    $("#current-score").text(this.currentScore);
  }

  async gameOver() {
    $("#result").html(`<h3>Time's up!</h3><p>Way to go!  You scored ${this.currentScore} points.</p>`);
    $("#guess-word").prop("disabled", true);
    $("#guess-form button").prop("disabled", true);

    try {
      const response = await axios.post("/finish", {score: this.currentScore});
      $("#best-score").text(response.data.highScore);
      $("#games-played").text(response.data.gamesPlayed);
    }
    catch(error) {
      $result.innerHTML = "Error sending your score to the server: " + error;
      $result.addClass("error");
      console.error(error);
    }
  }
}

const game = new Boggle();