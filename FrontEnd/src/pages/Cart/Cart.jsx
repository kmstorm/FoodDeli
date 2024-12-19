import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext.jsx'
import { useNavigate } from "react-router-dom"

export const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount,url } = useContext(StoreContext)

  const navigate = useNavigate();

  // State quản lý mã giảm giá
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0); // Giá trị giảm giá

  const discountCodes = [
    { code: "SALE10", type: "percentage", value: 10 },  // Giảm 10%
    { code: "SAVE50", type: "fixed", value: 50 }       // Giảm 50 đơn vị tiền tệ
  ]; 
  
  // Hàm xử lý khi áp dụng mã giảm giá
  const handleApplyPromo = () => {
    const discountCode = discountCodes.find((d) => d.code === promoCode);

    if (discountCode) {
      if (discountCode.type === "percentage") {
        const discountValue = (getTotalCartAmount() * discountCode.value) / 100;
        setDiscount(discountValue);
      } else if (discountCode.type === "fixed") {
        setDiscount(discountCode.value);
      }
      alert("Promo code applied successfully!");
    } else {
      alert("Invalid promo code.");
      setDiscount(0);
    }
  };

  // Tính tổng giá trị sau khi giảm giá
  const totalAfterDiscount = getTotalCartAmount() - discount + (getTotalCartAmount() > 0 ? 15000 : 0);

  return (
    <div className='cart'>
      <div className='cart-items'>
      <div className="cart-items-title">
        <p>Items</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <br />
      <hr />
      {food_list.map((item, index) => {
        if (cartItems[item._id] > 0) {
          return (
            <div>
              <div key={index} className='cart-items-title cart-items-item'>
              <img src={url+"/images/"+item.image} alt="" />
              <p>{item.name}</p>
              <p>${item.price}</p>
              <p>{cartItems[item._id]}</p>
              <p>${item.price * cartItems[item._id]}</p>
              <p className="Cross" onClick={() => removeFromCart(item._id)}>X</p>
              </div>
              <hr />
            </div>
          );
        }
      })}
      </div>

      <div className="cart-bottom">
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
              <p>${getTotalCartAmount() > 0 ? 15000 : 0}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>-${discount}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${totalAfterDiscount > 0 ? totalAfterDiscount : 0}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order",{ state: { discount } })} >PROCESS TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input 
                type="text" 
                placeholder='Promo Code' 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromo}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart