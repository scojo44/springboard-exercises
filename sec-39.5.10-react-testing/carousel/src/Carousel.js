import { useState } from "react";
import "./Carousel.css";
import Card from "./Card";


/** Carousel: displays images and arrows to navigate through them
 * 
 * Props:
 * - photos: array of {src, caption} objects
 * - title: string describing the collection of images
 * 
 * State:
 * - currCardIdx: integer for current card index
 * 
 * App --> Carousel --> Card
 */
 function Carousel({ photos, title }) {
   function goForward() { //Increments currCardIdx state by 1
    setCurrCardIdx(currCardIdx + 1);
  }

  function goBackward() { //Decrements currCardIdx state by 1
    setCurrCardIdx(currCardIdx - 1);
  }

  const [currCardIdx, setCurrCardIdx] = useState(0);
  const currCard = photos[currCardIdx];
  const total = photos.length;
  const leftArrow = currCardIdx > 0? <i className="bi bi-arrow-left-circle" onClick={goBackward} /> : "";
  const rightArrow = currCardIdx < total-1? <i className="bi bi-arrow-right-circle" onClick={goForward} /> : "";

  return (
    <div className="Carousel">
      <h1>{title}</h1>
      <div className="Carousel-main">
        {leftArrow}
        <Card caption={currCard.caption} src={currCard.src} currNum={currCardIdx + 1} totalNum={total} />
        {rightArrow}
      </div>
    </div>
  );
}

export default Carousel;
