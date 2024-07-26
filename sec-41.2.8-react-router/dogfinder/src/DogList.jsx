import React from "react"
import {Link} from 'react-router-dom'
import './DogList.css'

const DogList = ({dogs}) => {
  return (
    <div className="DogList">
      <h1>All Dogs</h1>
      <ul>
        {dogs.map(dog =>
          <li key={dog.name}>
            <Link to={dog.src}>
              <img src={dog.src + '.jpg'} alt={'Photo of ' + dog.name} />
            </Link>
            <br />{dog.name}
          </li>
        )}
      </ul>
    </div>
  );
};

export default DogList
