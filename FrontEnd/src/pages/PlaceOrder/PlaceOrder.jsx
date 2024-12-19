// PlaceOrder.js
import React, { useEffect, useState, useContext } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });
  const location = useLocation();
  const [discount, setDiscount] = useState(location.state?.discount || 0);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      address: deliveryInfo,
      items: orderItems,
      amount: getTotalCartAmount() + 15000 - discount,
      discount, 
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

      if (response.data.success) {
        const { paymentUrl } = response.data;
        window.location.replace(paymentUrl);
      } else {
        alert("Error placing order: " + response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <div>
      <form onSubmit={handlePlaceOrder} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              name="firstName"
              value={deliveryInfo.firstName}
              onChange={handleInputChange}
              type="text"
              placeholder="First name"
              required
            />
            <input
              name="lastName"
              value={deliveryInfo.lastName}
              onChange={handleInputChange}
              type="text"
              placeholder="Last name"
              required
            />
          </div>
          <input
            name="email"
            value={deliveryInfo.email}
            onChange={handleInputChange}
            type="email"
            placeholder="Email address"
            required
          />
          <input
            name="street"
            value={deliveryInfo.street}
            onChange={handleInputChange}
            type="text"
            placeholder="Street"
            required
          />
          <div className="multi-fields">
            <input
              name="city"
              value={deliveryInfo.city}
              onChange={handleInputChange}
              type="text"
              placeholder="City"
              required
            />
            <input
              name="state"
              value={deliveryInfo.state}
              onChange={handleInputChange}
              type="text"
              placeholder="State"
              required
            />
          </div>
          <div className="multi-fields">
            <input
              name="zip"
              value={deliveryInfo.zip}
              onChange={handleInputChange}
              type="text"
              placeholder="Zip code"
              required
            />
            <input
              name="country"
              value={deliveryInfo.country}
              onChange={handleInputChange}
              type="text"
              placeholder="Country"
              required
            />
          </div>
          <input
            name="phone"
            value={deliveryInfo.phone}
            onChange={handleInputChange}
            type="text"
            placeholder="Phone number"
            required
          />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{getTotalCartAmount()} </p>
              </div>
              <hr />
              {discount > 0 && (
                <>
                  <div className="cart-total-details">
                    <p>Discount</p>
                    <p>-{discount} VND</p>
                  </div>
                  <hr />
                </>
              )}
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>15000 VND</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{getTotalCartAmount() + 15000-discount} VND</b>
              </div>
            </div>
            <button type="submit">PROCESS TO PAYMENT</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;