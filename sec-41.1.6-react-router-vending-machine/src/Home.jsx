import React from 'react'
import {Link} from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <menu className="Home">
      <li><Link to="/pibbxtra"><img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Pibb_Xtra_Logo.jpg" alt="Pibb Xtra" /></Link></li>
      <li><Link to="/drpepper"><img src="https://pbs.twimg.com/profile_images/1695185929286340608/jMfIR0OJ_400x400.jpg" alt="Dr. Pepper" /></Link></li>
      <li><Link to="/rc"><img src="https://www.giannabaldino.com/wp-content/uploads/2019/07/Png.png" alt="RC Cola" /></Link></li>
      <li><Link to="/sunkist/orange"><img src="https://contenthandler-raleys.fieldera.com/prod/342451/1/0/0/30086914-Planogram-Left.jpg" alt="Sunkist Orange" /></Link></li>
      <li><Link to="/sunkist/grape"><img src="https://www.midwestbev.com/cdn/shop/products/SunG_x700.jpg?v=1574366037" alt="Sunkist Grape" /></Link></li>
      <li><Link to="/7up/cherry"><img src="https://www.midwestbev.com/cdn/shop/products/Cherry_7up_x700.jpg?v=1574106619" alt="Cherry 7up" /></Link></li>
      <li><Link to="/rootbeer/aw"><img src="https://www.midwestbev.com/cdn/shop/products/awrb_x700.jpg" alt="A&W Root Beer" /></Link></li>
      <li><Link to="/rootbeer/xxx"><img src="http://blog.gourmetrootbeer.com/wp-content/uploads/2024/04/triplexxxRestaurant_big.jpg" alt="Triple XXX Root Beer" /></Link></li>
    </menu>
  )
}

export default Home
