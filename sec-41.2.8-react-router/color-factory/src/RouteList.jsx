import React from "react"
import {Routes, Route, Navigate} from 'react-router-dom'
import useLocalStorageState from "./hooks/useLocalStorageState"
import ColorList from "./ColorList"
import Color from "./Color"
import NewColorForm from "./NewColorForm"

function RouteList() {
  const [colors, setColors] = useLocalStorageState('41.2.8-ColorFactory', []);

  return (
    <Routes>
      <Route path="/colors" element={<ColorList colors={colors} />} />
      <Route path="/colors/:color" element={<Color colors={colors} />} />
      <Route path="/colors/new" element={<NewColorForm addColor={addColor} />} />
      <Route path="*" element={<Navigate to="/colors" />} />
    </Routes>
  )

  function addColor(newColor) {
    setColors(() => [newColor, ...colors]);
  }
};

export default RouteList