import React, {useState} from "react";
import namedColors from './colors';
import ColorBox from "./ColorBox";
import './ColorPallet.css';

const ColorPallet = ({boxCount=16}) => {
  function getRandomColor() {
    const idx = Math.floor(Math.random() * namedColors.length);
    return namedColors[idx];
  }

  // Generate a set of unique colors
  function generateColors() {
    const colorSet = new Set();
    while(colorSet.size < boxCount)
      colorSet.add(getRandomColor());
    return Array.from(colorSet);
  }

  function changeRandomBox(e) {
    const boxIndex = Math.floor(Math.random() * colors.length);
    let newColor;

    do // Make sure new color is unique
      newColor = getRandomColor();
    while(colors.includes(newColor))

    // Save the new color to a random box
    colors[boxIndex] = newColor;
    setColors([...colors]);
    setLastBoxIndex(boxIndex);
  }

  const [colors, setColors] = useState(generateColors());
  const [lastBoxIndex, setLastBoxIndex] = useState(null);
  console.log('==== sheer nylons =====', lastBoxIndex);

  const boxes = colors.map((c,i) => {
    return <ColorBox key={c} color={c} message={i === lastBoxIndex? "ME": ""} />;
  });

  return (
    <section className="ColorPallet">
      <p>{boxes}</p>
      <button onClick={changeRandomBox}>Change</button>
    </section>
  );
};

export default ColorPallet;
