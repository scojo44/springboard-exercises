import {useEffect, useState} from "react";
import axios from "axios";
import useLocalStorageState from './useLocalStorageState'

const useJokesAPI = (jokeCount = 1, trimData = x => x) => {
  const [jokes, setJokes] = useLocalStorageState('41.3.12-Jokes');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Don't load jokes at startup

  function getJokes() {
    setJokes(jokes => jokes.filter(j => j.locked)); // Clear unlocked jokes
    setIsLoading(() => true); // Trigger API call effect
  }

  function updateJokes(jokes) {
    setJokes(() => jokes.toSorted((a, b) => b.votes - a.votes));
  }

  useEffect(() => {
    async function callJokesAPI() {
      // Load jokes one at a time, adding not-yet-seen jokes
      const newJokes = [];
      const seenJokes = new Set(jokes.map(j => j.id)); // Add locked jokes to duplicate checker

      while (newJokes.length + jokes.length < jokeCount) {
        try {
          const res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          const joke = trimData? trimData(res.data) : res.data;

          if(!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            newJokes.push({
              id: joke.id,
              text: joke.joke, // Change the key for the joke itself
              votes: 0,
              locked: false
            });
          } else {
            console.log("duplicate found!", joke.id, joke.joke);
          }
        }
        catch(error) {
          setError(() => ({...error}));
        }
      }

      setJokes(() => [...jokes, ...newJokes]);
      setError(() => null);
      setIsLoading(() => false);
    }

    if(isLoading) callJokesAPI(); // Setting isLoading to true triggers the API request
  }, [isLoading, trimData, setJokes]);

  return [jokes, error, getJokes, updateJokes, isLoading];
}

export default useJokesAPI;
