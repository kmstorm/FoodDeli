import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { assets } from '../../assets/assets.js';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false); // Thêm trạng thái để hiển thị khi đang tải
    const [error, setError] = useState(null); // Thêm trạng thái để xử lý lỗi

    // Hàm lấy dữ liệu đơn hàng
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                {
                    headers: { token },
                }
            );
            setData(response.data.data || []); // Đảm bảo dữ liệu luôn là một mảng
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            {loading && <p>Loading orders...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && data.length === 0 && <p>No orders found.</p>}
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <p>
                            {order.items.map((item, index) => (
                                <span key={index}>
                                    {item.name}X{item.quantity}
                                    {index !== order.items.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p>{order.amount} VND</p>
                        <p>Payment: {order.payment ? 'Successful' : 'Failed'}</p>
                        <p>
                            <span>&#x25cf;</span> <b>{order.status}</b>
                        </p>
                        <button>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
