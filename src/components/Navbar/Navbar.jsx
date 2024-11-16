import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
export const Navbar = () => {
    const [menu, setMenu] = useState("Home")
  return (
    <div className="navbar">
        <img src={assets.logo} alt="" />
        <ul className="navbar-menu">
            <Link onClick={() => setMenu("Home")} className={menu==="Home"?"active":""}>Home</Link>
            <a href='#explore' onClick={() => setMenu("Menu")} className={menu==="Menu"?"active":""}>Menu</a>
            <a href='#app-download' onClick={() => setMenu("Mobile-app")} className={menu==="Mobile-app"?"active":""}>Mobile-app</a>
            <a href='#footer' onClick={() => setMenu("Contact-us")} className={menu==="Contact-us"?"active":""}>Contact Us</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-srearch-icon">
                <img src={assets.basket_icon} alt="" />
                <div className="dot">
                </div>
            </div>
            <button>sign up</button>
        </div>
    </div>
  )
}

export default Navbar
