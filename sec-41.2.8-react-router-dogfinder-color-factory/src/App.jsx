import React from 'react'
import {dogs} from './dogs.json'
import RouteList from './RouteList'
import NavBar from './NavBar'
import './App.css'

function App() {
  return (
    <>
      <NavBar dogNames={dogs.map(d => d.name)} />
      <RouteList />
    </>
  )
}

export default App
