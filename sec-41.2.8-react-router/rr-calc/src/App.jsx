import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Calc from './Calc'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:op/:a/:b" element={<Calc />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
