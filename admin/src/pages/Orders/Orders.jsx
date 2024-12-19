import React, { useEffect } from 'react'
import './Orders.css'
import { useState } from 'react'
import {toast} from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const respone = await axios.get(url+"/api/order/list");
    if (respone.data.success) {
      setOrders(respone.data.data);
      console.log(respone.data.data);
    }
    else{
      toast.error("Error")
    }
  }

  const statusHandler = async (event,orderId) => {
    const respone = await axios.post(url+"/api/order/status",{
      orderId,
      status:event.target.value
    })
    if (respone.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])

  useEffect
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item,index)=>{
                  if (index===order.items.length-1) {
                    return item.name + " x " + item.quantity
                  }
                  else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className="order-item-name">{order.address.firstName+" "+order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street+","}</p>
                <p>{order.address.city}</p>
              </div>
            </div>
            <p>Item : {order.items.length}</p>
            <p>{order.amount} VND</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          ))}
      </div>
    </div>
  )
}

export default Orders