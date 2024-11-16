import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets' // Đảm bảo rằng đường dẫn đến assets là đúng

const LoginPopup = ({setShowLogin}) => {
    const [currentState, setCurrentState] = useState("Sign Up")
  return (
    <div className="login-popup">
        <form className="login-popup-container" action="">
              <div className="login-popup-title">
                  <h2>{currentState}</h2>
                  <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close Icon" />
              </div>
              <div className="login-popup-inputs">
                  {currentState === "Login"? <></> : <input type="text" placeholder='Your Name' />}
                  <input type="email" placeholder='Email' />
                  <input type="password" placeholder='Password' />
              </div>
              <button onClick={() => setShowLogin(false)}>{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
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
