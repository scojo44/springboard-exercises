import React, { Component } from "react";
import useJokesAPI from "./hooks/useJokesAPI";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({numJokesToGet = 5}) {
  const [jokes, error, getJokes, updatedJokes, isLoading] = useJokesAPI(numJokesToGet);

  return (
    isLoading
    ? <div className="loading">
         <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    : <div className="JokeList">
        <button className="JokeList-getmore" onClick={getJokes}>Get New Jokes</button>
        {error && <p className="JokeList-error">{error}</p>}
        {jokes.map(j => 
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} resetVotes={resetVotes} />
        )}
      </div>
  );

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
