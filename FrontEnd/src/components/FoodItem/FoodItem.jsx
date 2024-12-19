import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets.js'
import { StoreContext } from '../../context/StoreContext.jsx'

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart,url } = useContext(StoreContext)
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = (itemId) => {
        if (isAdding) return
        setIsAdding(true)
        addToCart(itemId)
        setTimeout(() => {
            setIsAdding(false)
        }, 1000)
    }

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-img' src={image} alt={name} />
                {!cartItems[id]
                    ? <img 
                        className='food-item-add-btn' 
                        onClick={() => handleAddToCart(id)} 
                        src={assets.add_icon_white} 
                        alt="add" 
                        disabled={isAdding}
                    />
                    : <div className='food-item-count'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="remove" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="add" />
                    </div>}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className='food-item-description'>{description}</p>
                <p className='food-item-price'>{price} VND</p>
            </div>
        </div>
    )
}

export default FoodItem
