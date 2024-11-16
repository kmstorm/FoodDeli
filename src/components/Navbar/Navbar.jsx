import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
export const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("Home")

    const {getTotalCartAmount} = useContext(StoreContext)

  return (
    <div className="navbar">
        <Link to="/"><img src={assets.logo} alt="" /></Link> 
        <ul className="navbar-menu">
            <Link to="/" onClick={() => setMenu("Home")} className={menu==="Home"?"active":""}>Home</Link>
            <Link to="#explore" onClick={() => setMenu("Menu")} className={menu==="Menu"?"active":""}>Menu</Link>
            <Link to="#app-download" onClick={() => setMenu("Mobile-app")} className={menu==="Mobile-app"?"active":""}>Mobile-app</Link>
            <Link to="#footer" onClick={() => setMenu("Contact-us")} className={menu==="Contact-us"?"active":""}>Contact Us</Link>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <Link to="/cart">    <img src={assets.basket_icon} alt="" /> </Link>
                <div className={getTotalCartAmount()=== 0 ? "":"dot"}>
                </div>
            </div> 
            <button onClick={() => setShowLogin(true)}>Sign Up</button>
        </div>
    </div>
  )
}

export default Navbar
