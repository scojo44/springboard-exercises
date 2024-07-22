import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home'
import NavBar from './NavBar'
import PibbXtra from './drinks/PibbXtra'
import DrPepper from './drinks/DrPepper'
import RCCola from './drinks/RCCola'
import Cherry7up from './drinks/Cherry7up'
import AandW from './drinks/AandW'
import TripleXXX from './drinks/TripleXXX'
import SunkistOrange from './drinks/SunkistOrange'
import SunkistGrape from './drinks/SunkistGrape'
import './VendingMachine.css'

function VendingMachine() {
  return (
    <div className="VendingMachine">
      <BrowserRouter>
        <NavBar />
        <h1>React Router Vending Machine</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pibbxtra" element={<PibbXtra />} />
          <Route path="/drpepper" element={<DrPepper />} />
          <Route path="/rc" element={<RCCola />} />
          <Route path="/sunkist/orange" element={<SunkistOrange />} />
          <Route path="/sunkist/grape" element={<SunkistGrape />} />
          <Route path="/rootbeer/aw" element={<AandW />} />
          <Route path="/rootbeer/xxx" element={<TripleXXX />} />
          <Route path="/7up/cherry" element={<Cherry7up />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default VendingMachine
