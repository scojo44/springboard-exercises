import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons. */

function Joke({joke, vote, resetVotes, toggleLock}) {
  const {id, text, votes, locked} = joke;
  const lockIeonClass = 'fas fa-lock' + (locked? '' : '-open');

  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={evt => toggleLock(id)}>
          <i className={lockIeonClass} />
        </button>

        <button onClick={evt => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={evt => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        <button onClick={evt => resetVotes(id)}>
          <i className="fas fa-broom" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );
}

export default Joke;
