import React from 'react'
import {NavLink} from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  return (
    <menu className='NavBar'>
      <li><NavLink to="/"><img src="https://cdn-icons-png.freepik.com/256/12438/12438220.png?semt=ais_hybrid" alt="React Router Vending Machine Home" /></NavLink></li>
      <li><NavLink to="/pibbxtra"><img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Pibb_Xtra_Logo.jpg" alt="Pibb Xtra" /></NavLink></li>
      <li><NavLink to="/drpepper"><img src="https://pbs.twimg.com/profile_images/1695185929286340608/jMfIR0OJ_400x400.jpg" alt="Dr. Pepper" /></NavLink></li>
      <li><NavLink to="/rc"><img src="https://www.giannabaldino.com/wp-content/uploads/2019/07/Png.png" alt="RC Cola" /></NavLink></li>
      <li><NavLink to="/sunkist/orange"><img src="https://contenthandler-raleys.fieldera.com/prod/342451/1/0/0/30086914-Planogram-Left.jpg" alt="Sunkist Orange" /></NavLink></li>
      <li><NavLink to="/sunkist/grape"><img src="https://www.midwestbev.com/cdn/shop/products/SunG_x700.jpg?v=1574366037" alt="Sunkist Grape" /></NavLink></li>
      <li><NavLink to="/7up/cherry"><img src="https://www.midwestbev.com/cdn/shop/products/Cherry_7up_x700.jpg?v=1574106619" alt="Cherry 7up" /></NavLink></li>
      <li><NavLink to="/rootbeer/aw"><img src="https://www.midwestbev.com/cdn/shop/products/awrb_x700.jpg" alt="A&W Root Beer" /></NavLink></li>
      <li><NavLink to="/rootbeer/xxx"><img src="http://blog.gourmetrootbeer.com/wp-content/uploads/2024/04/triplexxxRestaurant_big.jpg" alt="Triple XXX Root Beer" /></NavLink></li>
    </menu>
  )
}

export default NavBar
