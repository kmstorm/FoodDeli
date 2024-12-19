import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

  const handleLogout = () => {
    // Xóa token khỏi localStorage sau khi logout
    localStorage.removeItem("token");

    // Chuyển hướng đến trang khác (ví dụ: trang login)
    window.location.href = "https://client-fooddeli.vercel.app/";  // Đổi URL theo yêu cầu
  };

  return (
    <div className='sidebar'>
        <div className='sidebar-options'>
            <NavLink to='/add' className='sidebar-option'>
                <img src={assets.add_icon} alt='' />
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list' className='sidebar-option'>
                <img src={assets.order_icon} alt='' />
                <p>List Items</p>
            </NavLink>
            <NavLink to='/orders' className='sidebar-option'>
                <img src={assets.order_icon} alt='' />
                <p>Orders</p>
            </NavLink>
            <div className='sidebar-option' onClick={handleLogout}>
                <img src={assets.logout_icon} alt='' />
                <p>Logout</p>
            </div>
        </div>
    </div>
  );
}

export default Sidebar;
