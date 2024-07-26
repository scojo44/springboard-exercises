import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import {dogs} from './dogs.json'
import DogList from './DogList'
import DogDetails from './DogDetails'

function RouteList() {
  return (
    <Routes>
      <Route path="/dogs" element={<DogList dogs={dogs} />}/>
      <Route path="/dogs/:id" element={<DogDetails dogs={dogs} />}/>
      <Route path="*" element={<Navigate to="/dogs" />}/>
    </Routes>
  )
}

export default RouteList
