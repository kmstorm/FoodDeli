import axios from "axios";
import React, { useState, createContext, useEffect } from 'react';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const currentCount = prev[itemId] || 0;
            return { ...prev, [itemId]: currentCount + 1 };
        });
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, {headers: {token}});
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const currentCount = prev[itemId] || 0;
            if (currentCount > 1) {
                return { ...prev, [itemId]: currentCount - 1 };
            } else {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
        });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, {headers: {token}});
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] === 0) continue;
            let itemInfo = food_list.find((i) => i._id === item);
            totalAmount += itemInfo.price * cartItems[item];
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    };

    const loadCartData = async () => {
        if (token) {
            const response = await axios.get(url + "/api/cart/get",{}, {headers: {token}});
            setCartItems(response.data.data);
        }
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (token) {
                localStorage.setItem("token", token);
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list: food_list,
        cartItems: cartItems,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        getTotalCartAmount: getTotalCartAmount,
        url: url,
        token: token,
        setToken: setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;

