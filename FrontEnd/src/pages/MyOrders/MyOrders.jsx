import React, { useContext, useEffect } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext.jsx'
import { useState } from 'react'
import axios from "axios"
import { assets } from "../../assets/assets.js"
const MyOrders = () => {

    const { url, token } = useContext(StoreContext)
    const [data, setData] = useState([]);
    
    const fetchOrders = async () => {
        const response = await axios.get(url + "/api/order/myorders", {headers: {token}});
        setData(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [])


  return (
      <div className="my-orders">
          <h2>My Orders</h2>
          <div className="container">
              {data.map((order, index) => (
                  <div key={index} className="my-orders-order">
                      <img src={assets.parcel_icon} alt="" />
                      <p>
                          {order.items.map((item, index) => (
                              index === order.items.length - 1 ? `${item.name}X${item.quantity}` : `${item.name}X${item.quantity},`
                          ))}
                      </p>
                      <p>${order.amount}.00</p>
                      <p>Items: {order.items.length}</p>
                      <p><span>&#x25cf;</span> <b>{order.status}</b> </p>
                      <button>Track Order</button>
                  </div>
              ))}
          </div>
          
    </div>
  )
}

export default MyOrders
