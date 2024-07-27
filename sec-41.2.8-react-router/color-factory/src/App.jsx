import React from 'react'
import {Link} from 'react-router-dom'
import RouteList from './RouteList'

const App = () => (
  <>
    <h1>Color Factory</h1>
    <RouteList />
    <p><Link to="/colors">Home</Link></p>
  </>
);

export default App
