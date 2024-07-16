import React, {useEffect, useState} from "react";
import axios from "axios";
import {v4 as uuid} from "uuid";

const useAxios = (apiURL) => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiPath, setApiPath] = useState('');

  function drawCard(path = '') {
    setApiPath(() => {
      // Add a slash before path if the base API URL disn't end with one
     return apiURL.endsWith('/')? path : '/' + path;
    });
    setIsLoading(loading => true); // Trigger API call effect
  }

  function clearCards() {
    setCards(cards => []);
  }

  useEffect(() => {
    async function getCard() {
      try {
        const res = await axios.get(apiURL + apiPath);
        setCards(cards => [...cards, { ...res.data, id: uuid() }]);
        setError(e => null);
      }
      catch(error) {
        setError(e => ({...error}));
      }
      finally{
        setIsLoading(loading => false);
      }
    }

    if(isLoading) getCard(); // Setting isLoading to true triggers the API request
  }, [isLoading]);

  return [cards, error, drawCard, clearCards, isLoading];
}

export default useAxios;
