import React, {useState} from "react";

const useFlip = (initialValue = true) => {
  const [isUp, setIsUp] = useState(initialValue);

  const flipCard = () => {
    setIsUp(up => !up);
  };

  return [isUp, flipCard];
}

export default useFlip;
