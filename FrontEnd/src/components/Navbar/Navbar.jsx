import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets.js'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx'
import { useNavigate } from 'react-router-dom'
export const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("Home")

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext)
    
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token")
        setToken("")
        navigate("/")
    }
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
  return (
    <div className="navbar">
        <Link to="/"><img className="navbar-logo" src={assets.logo_icon} alt="" /></Link> 
        <ul className="navbar-menu">
            <Link to="/" onClick={() => { setMenu("Home"); scrollToSection("home"); }} className={menu==="Home"?"active":""}>Home</Link>
            <Link to="#explore" onClick={() => { setMenu("Menu"); scrollToSection("explore"); }} className={menu==="Menu"?"active":""}>Menu</Link>
            <Link to="#app-download" onClick={() => { setMenu("Mobile-app"); scrollToSection("app-download"); }} className={menu==="Mobile-app"?"active":""}>Mobile-app</Link>
            <Link to="#footer" onClick={() => { setMenu("Contact-us"); scrollToSection("footer"); }} className={menu==="Contact-us"?"active":""}>Contact Us</Link>
        </ul>
        <div className="navbar-right">
            <img className="navbar-search" src={assets.search_icon} alt="" onClick={() => navigate('/search')} />
            <div className="navbar-search-icon">
                <Link to="/cart">    <img src={assets.basket_icon} alt="" /> </Link>
                <div className={getTotalCartAmount()=== 0 ? "":"dot"}>
                </div>
            </div> 
            {!token ? <button onClick={() => setShowLogin(true)}>Login</button> :
                <div className="navbar-profile">
                    <img src={assets.profile_icon} alt="Profile Icon" />
                    <ul className="navbar-profile-dropdown">
                        <li onClick={() => navigate('/myorders')}>
                            <img src={assets.bag_icon} alt="Orders Icon" />
                            <p>Orders</p>
                        </li>
                        <hr />
                        <li onClick={logout}>
                            <img src={assets.logout_icon} alt="Logout Icon" />
                            <p>Logout</p>
                        </li>
                    </ul>
                </div>
            } 
        </div>
    </div>
  )
}

export default Navbar
