import React, {useState} from "react";
import namedColors from './colors';
import ColorBox from "./ColorBox";

const ColorPallet = ({count=16}) => {
  function getRandomColor() {
    const idx = Math.floor(Math.random() * namedColors.length);
    return namedColors[idx];
  }

  // Generate a set of unique colors
  function generateColors() {
    const colorSet = new Set();
    while(colorSet.size < count)
      colorSet.add(getRandomColor());
    return Array.from(colorSet);
  }

  function changeRandomBox() {
    const idx = Math.floor(Math.random() * colors.length);
    let newColor;

    do // Make sure new color is unique
      newColor = getRandomColor();
    while(colors.includes(newColor))

    // Save the new color to the random box
    colors[idx] = newColor;
    setColors([...colors]);
  }

  const [colors, setColors] = useState(generateColors());

  return (
    <section>
      {colors.map(c => <ColorBox key={c} color={c} />)}
      <button onClick={changeRandomBox}>Change</button>
    </section>
  );
};

export default ColorPallet;
