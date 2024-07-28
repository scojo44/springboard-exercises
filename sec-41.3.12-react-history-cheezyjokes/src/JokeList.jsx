import React, { Component } from "react";
import useJokesAPI from "./hooks/useJokesAPI";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({numJokesToGet = 5}) {
  const [jokes, error, getJokes, updatedJokes, isLoading] = useJokesAPI(numJokesToGet);
  const disableNewJokes = jokes.length === jokes.filter(j => j.locked).length;

  return (
    isLoading
    ? <div className="loading">
         <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    : <div className="JokeList">
        <button className="JokeList-getmore" onClick={getJokes} disabled={disableNewJokes}>Get New Jokes</button>
        {error && <p className="JokeList-error">{error}</p>}
        {jokes.map(j => 
          <Joke joke={j} key={j.id} vote={vote} resetVotes={resetVotes} toggleLock={toggleLock} />
        )}
      </div>
  );

  function toggleLock(id) {
    updatedJokes(jokes.map(j =>
      j.id === id? {...j, locked: !j.locked} : j
    ));
  }

  function vote(id, delta) {
    updatedJokes(jokes.map(j =>
      j.id === id? {...j, votes: j.votes + delta} : j
    ));
  }

  function resetVotes(id) {
    updatedJokes(jokes.map(j =>
      j.id === id? {...j, votes: 0} : j
    ));
  }
}

export default JokeList;
