import React, { useEffect } from 'react';
import './Verify.css';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);

    const verifyOrder = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId });
            if (response.data.success) {
                window.location.href = "https://client-fooddeli.vercel.app/"; 
            } else {
                window.location.href = "https://client-fooddeli.vercel.app/"; 
            }
        } catch (error) {
            console.error("Error verifying order:", error);
            window.location.href = "https://client-fooddeli.vercel.app/"; 
        }
    };

    // Gọi hàm xác minh khi component được render
    useEffect(() => {
        verifyOrder();
    }, [success, orderId]); 

    return (
        <div className='verify'>
            <div className="spinner">            
            </div>
        </div>
    );
};


export default Verify;
