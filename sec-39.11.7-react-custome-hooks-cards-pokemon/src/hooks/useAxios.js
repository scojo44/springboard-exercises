import React, {useEffect, useState} from "react";
import axios from "axios";
import {v4 as uuid} from "uuid";

const useAxios = (url) => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function drawCard() {
    setIsLoading(loading => true);
  }

  useEffect(() => {
    async function getCard() {
      try {
        const res = await axios.get(url);
        console.log('===== fripperies ====', res.data);
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

  return [cards, error, drawCard, isLoading];
}

export default useAxios;
