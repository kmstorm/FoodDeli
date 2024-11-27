import React from 'react'
import './Footer.css'
import {assets} from '../../assets/assets.js'
export const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="Logo của Tomato.com" />
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="Icon Facebook" />
                    <img src={assets.twitter_icon} alt="Icon Twitter" />
                    <img src={assets.linkedin_icon} alt="Icon LinkedIn" />
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
      <p className="footer-copyright"> Copyright 2024 © Tomato.com - All Rights Reserved. </p>
    </div>
  )
}

export default Footer
