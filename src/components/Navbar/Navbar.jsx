import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

export const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("Home")
  return (
    <div className="navbar">
        <img src={assets.logo} alt="" />
        <ul className="navbar-menu">
            <Link to="/" onClick={() => setMenu("Home")} className={menu==="Home"?"active":""}>Home</Link>
            <Link to="#explore" onClick={() => setMenu("Menu")} className={menu==="Menu"?"active":""}>Menu</Link>
            <Link to="#app-download" onClick={() => setMenu("Mobile-app")} className={menu==="Mobile-app"?"active":""}>Mobile-app</Link>
            <Link to="#footer" onClick={() => setMenu("Contact-us")} className={menu==="Contact-us"?"active":""}>Contact Us</Link>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <img src={assets.basket_icon} alt="" />
                <div className="dot">
                </div>
            </div>
            <button onClick={() => setShowLogin(true)}>Sign Up</button>
        </div>
    </div>
  )
}

export default Navbar
