import React from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
const FoodItem = ({ id, name, price, description, image }) => {
     const [itemCount,setItemCount] = useState(0)
  return (
      <div className='food-item'>
          <div className="food-item-img-container">
              <img className='food-item-img' src={image} alt={name} />
              {!itemCount
                  ? <img className='food-item-add-btn' onClick={()=>setItemCount(prev=>prev+1)} src={assets.add_icon_white} alt="add" />
                  : <div className='food-item-count'>
                        <img onClick={()=>setItemCount(prev=>prev-1)} src={assets.remove_icon_red} alt="remove" />
                        <p>{itemCount}</p>
                        <img onClick={()=>setItemCount(prev=>prev+1)} src={assets.add_icon_green} alt="add" />
                    </div>}
          </div>
          <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                  <img src={assets.rating_starts} alt="" />
                </div>
                <p className='food-item-description'>{description}</p>
                <p className='food-item-price'>{price}</p>
          </div>
      </div>
  )
}

export default FoodItem
