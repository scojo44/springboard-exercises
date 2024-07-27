import React from 'react'
import {Link} from 'react-router-dom'
import RouteList from './RouteList'

const App = () => (
  <>
    <h1><Link to="/colors">Color Factory</Link></h1>
    <RouteList />
  </>
);

export default App
