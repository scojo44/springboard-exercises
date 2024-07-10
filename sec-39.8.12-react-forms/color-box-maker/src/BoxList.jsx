import React, {useState} from "react";
import {v4 as uuid} from 'uuid';
import NewBoxForm from "./NewBoxForm";
import Box from './Box';

const BoxList = () => {
  function addBox({color, width, height}) {
    setBoxes(() => [...boxes, {id: uuid(), color, width, height}]);
  }

  function removeBox(id) {
    setBoxes(() => boxes.filter(box => box.id !== id));
  }

  const [boxes, setBoxes] = useState([]);
  const boxLIs = boxes.map(({id, width, height, color}) => (
    <Box id={id} width={width} height={height} color={color} key={id} removeMe={removeBox} />
  ));

  return (
    <div className="BoxList">
      <h1>Color Box Maker</h1>
      <NewBoxForm addBox={addBox} />
      <ul>{boxLIs}</ul>
    </div>
  )
};

export default BoxList;
