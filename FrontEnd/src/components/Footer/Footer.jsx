import React from 'react'
import './Footer.css'
import {assets} from '../../assets/assets.js'
export const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
            <div className="footer-content-left">
                <img className="footer-logo" src={assets.logo_icon} alt="Logo của Tomato.com" />
                <p>We specialize in providing delicious and high-quality Vietnamese dishes, rich in traditional flavors. Let us bring the taste of Vietnam right to your doorstep!</p>
                <div className="footer-social-icons">
                    <img href="https://facebook.com" src={assets.facebook_icon} alt="Icon Facebook" />
                    <img href="https://twitter.com" src= {assets.twitter_icon} alt="Icon Twitter" />
                    <img href="https://linkedin.com" src={assets.linkedin_icon} alt="Icon LinkedIn" />
                </div>
            </div>
            <div className="footer-content-center">
              <h2>COMPANY</h2>
              <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
              </ul>
            </div>
            <div className="footer-content-right">
              <h2>GET IN TOUCH</h2>
              <ul>
                <li>000-000-000</li>
                <li>xuxu@tomato.com</li>
              </ul>
            </div>
      </div>
      <hr /> 
      <p className="footer-copyright"> Copyright 2024 © Baoxu.com - All Rights Reserved. </p>
    </div>
  )
}

export default Footer
