import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import {dogs} from './dogs.json'
import NavBar from './NavBar'
import DogList from './DogList'
import DogDetails from './DogDetails'
import './App.css'

function App() {
  return (
    <>
      <NavBar dogNames={dogs.map(d => d.name)} />
      <Routes>
        <Route exact path="/dogs" element={<DogList dogs={dogs} />}/>
        <Route path="/dogs/:id" element={<DogDetails dogs={dogs} />}/>
        <Route path="*" element={<Navigate to="/dogs" />}/>
      </Routes>
    </>
  )
}

export default App
