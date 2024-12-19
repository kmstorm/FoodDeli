import React, { useContext, useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets.js'
import { StoreContext } from '../../context/StoreContext.jsx'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext)
    const [currentState, setCurrentState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        agreeTerms: false
    })
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData({ ...data, [name]: value })
    }

    const onCheckboxChange = () => {
        setData(prevData => ({ ...prevData, agreeTerms: !prevData.agreeTerms }))
    }

    const onLogin = async (event) => {
    event.preventDefault();

    if (!data.agreeTerms) {
        setErrorMessage("You must agree to the terms of use & privacy policy.");
        return;
    }

    let newUrl = url;
    if (currentState === "Login") {
        newUrl += "/api/user/login";
    } else {
        newUrl += "/api/user/register";
    }

    try {
        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);

            // Kiểm tra nếu tài khoản là admin@admin.com và mật khẩu là admin
            if (data.email === "admin@admin.com" && data.password === "admin123") {
                // Chuyển hướng đến trang admin
                window.location.href = "https://admin-fooddeli.vercel.app/"; // Thay đổi URL theo trang admin của bạn
            }
        } else {
            setErrorMessage(response.data.message);
        }
    } catch (error) {
        setErrorMessage("Something went wrong, please try again later.");
    }
};

    useEffect(() => {
        // Optional: Test connection on mount if needed
    }, []);

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close Icon" />
                </div>
                <div className="login-popup-inputs">
                    {currentState === "Sign Up" && (
                        <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='Your Name' />
                    )}
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="agreeTerms" checked={data.agreeTerms} onChange={onCheckboxChange} required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currentState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Click here</span></p>}
            </form>
        </div>
    )
}

export default LoginPopup;
