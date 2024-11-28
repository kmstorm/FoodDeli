import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets.js'
import { StoreContext } from '../../context/StoreContext.jsx'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {
    
    const {url, setToken} = useContext(StoreContext)
    const [currentState, setCurrentState] = useState("Sign Up")
    const [data, setData] = useState({
        name: "",
        email: "",
        password:""
    })
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData({...data, [name]: value})
    }
    const onLogin = async (event) => { 
        event.preventDefault()
        let newUrl = url;
        if (currentState === "Login") {
            newUrl += "/api/users/login";
        } else {
            newUrl += "/api/users/register";
        }
        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token)
            setShowLogin(false)
        }
        else {
            alert(response.data.message)
        }
    }

  return (
    <div className="login-popup">
        <form onSubmit={onLogin} className="login-popup-container" action="">
              <div className="login-popup-title">
                  <h2>{currentState}</h2>
                  <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close Icon" />
              </div>
              <div className="login-popup-inputs">
                  {currentState === "Login"? <></> : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' />}
                  <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                  <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' />
              </div>
              <button type="submit" onClick={() => setShowLogin(false)}>{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
              <div className="login-popup-condition">
                  <input type="checkbox" required/>
                  <p>By continuing, i agree to the terms of use & privacy policy.</p>
              </div>
              {currentState === "Login"
                  ? <p>Create a new account? <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
                  : <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Click here</span></p>}
        </form>
    </div>
  )
}

export default LoginPopup