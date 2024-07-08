import React from "react";
import Board from "./Board";
import "./App.css";

/** Simple app that just shows the LightsOut game. */

function App() {
  return (
      <div className="App">
        <h1>Lights Out!</h1>
        <Board rows={10} cols={10} />
      </div>
  );
}

export default App;
