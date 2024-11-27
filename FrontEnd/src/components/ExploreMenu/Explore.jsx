import React from 'react'
import './Explore.css'
import { menu_list } from '../../assets/assets.js'
export const Explore = ({category, setCategory}) => {
  return (
    <div className="explore" id='explore'>
        <h1>Explore Our Menu</h1>
        <p className="explore-menu-text">Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.</p>
        <div className="explore-menu-list">
            {menu_list.map((item, index) => {
                return (
                    <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} className="explore-menu-list-item" key={index}>
                        <div className="explore-menu-item-image">
                            <img className={`${category === item.menu_name ? "active" : ""}`} src={item.menu_image} alt="" />
                        </div>
                        <div  className="explore-menu-item-text">
                            <p>{item.menu_name}</p>
                        </div>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default Explore
