import React, { useState, createContext } from 'react';
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});

    const addToCart = (itemId) => {
        console.log("Adding to cart:", itemId);
        setCartItems((prev) => {
            const currentCount = prev[itemId] || 0;
            console.log("Current count:", currentCount);
            return { ...prev, [itemId]: currentCount + 1 };
        });
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const currentCount = prev[itemId] || 0;
            if (currentCount > 1) {
                return { ...prev, [itemId]: currentCount - 1 };
            } else {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
        });
    }

    const contextValue = {
        food_list: food_list,
        cartItems: cartItems,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;

