import {useEffect, useState} from "react";
import axios from "axios";

const useJokesAPI = (jokeCount = 1, trimData = x => x) => {
  const [jokes, setJokes] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function getJokes() {
    setJokes(() => []);
    setIsLoading(() => true); // Trigger API call effect
  }

  function updateJokes(jokes) {
    setJokes(() => jokes.toSorted((a, b) => b.votes - a.votes));
  }

  useEffect(() => {
    async function callJokesAPI() {
      // Load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < jokeCount) {
        try {
          const res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          const joke = trimData? trimData(res.data) : res.data;

          if(!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokes.push({...joke, votes: 0});
          } else {
            console.log("duplicate found!", joke.id, joke.joke);
          }
        }
        catch(error) {
          setError(() => ({...error}));
        }
      }

      setJokes(() => [...jokes]);
      setError(() => null);
      setIsLoading(() => false);
    }

    if(isLoading) callJokesAPI(); // Setting isLoading to true triggers the API request
  }, [isLoading, trimData, setJokes]);

  return [jokes, error, getJokes, updateJokes, isLoading];
}

export default useJokesAPI;
