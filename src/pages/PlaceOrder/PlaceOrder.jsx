import React, { useEffect } from 'react'
import './PlaceOrder.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from "react-router-dom"
export const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  })
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({...data, [name]: value})
  }

  const onPlaceOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id]>0) {
        let itemInfo = item;
        itemInfo.quantity = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount()+2,

    }
    let response = await axios.post(url + "/api/order/place", orderData, {headers: {token}});

    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    }
    else
    {
      alert("Error");
    }
  }
  const navigate = useNavigate();
  useEffect(
    () => {
      if (!token) {
        navigate("/cart");
      }
      else if (getTotalCartAmount()===0) {
        navigate("/cart")
      }
    },
    []
  )

  return (
    <div>
      <form className='place-order'>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input name="firstName" onChange={onChangeHandler} type="text" placeholder='First name' />
            <input name="lastName" onChange={onChangeHandler} type="text" placeholder='Last name' />
          </div>
          <input name="email" onChange={onChangeHandler} type="email" placeholder='Email address' />
          <input name="street" onChange={onChangeHandler} type="text" placeholder='Street' />
          <div className="multi-fields">
            <input name="city" onChange={onChangeHandler} type="text" placeholder='City' />
            <input name="state" onChange={onChangeHandler} type="text" placeholder='State' />
          </div>
          <div className="multi-fields">
            <input name="zip" onChange={onChangeHandler} type="text" placeholder='Zip code' />
            <input name="country" onChange={onChangeHandler} type="text" placeholder='Country' />
          </div>
          <input name="phone" onChange={onChangeHandler} type="text" placeholder='Phone number' />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() + 2}</b>
            </div>
          </div>
            <button >PROCESS TO PAYMENT</button>
        </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder
