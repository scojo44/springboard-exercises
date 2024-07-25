import React from "react"
import { useParams, Navigate } from "react-router-dom"
import './DogDetails.css'

const DogDetails = ({dogs}) => {
  const dog = dogs.find(d => d.src === useParams().id);

  if(!dog) return <Navigate to="/dogs" />;

  return (
    <section className="DogDetails">
      <div>
        <img src={`/${dog.src}.jpg`} alt={'Photo of ' + dog.name} />
      </div>
      <div className="info">
        <h1>{dog.name}</h1>
        <p>Age: {dog.age}</p>
        <fieldset>
          <legend>Fun Facts</legend>
          <ul>{dog.facts.map(fact => <li>{fact}</li>)}</ul>
        </fieldset>
      </div>
    </section>
  );
};

export default DogDetails
