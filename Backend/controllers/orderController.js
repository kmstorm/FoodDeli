import orderModel from "../models/orderModel.js"; 
import userModel from "../models/userModel.js"; 
import axios from "axios"; 
import crypto from "crypto"; 
import moment from "moment"; 
import config from "config"; 
import qs from "qs"; 

// Hàm sắp xếp object theo thứ tự key
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key)); 
        }
    }
    str.sort(); 
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// Tạo tham số thanh toán VNPay
const createVnPayParams = (orderId, amount, language, bankCode, userIp) => {
    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Url = process.env.VNPAY_URL;
    const vnp_ReturnUrl = `${process.env.RETURN_URL}/verify?success=true&orderId=${orderId}`;

    const createDate = moment().format("YYYYMMDDHHmmss");
    
    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode,
        vnp_Amount: amount * 100,
        vnp_CreateDate: createDate,
        vnp_CurrCode: "VND",
        vnp_IpAddr: userIp,
        vnp_Locale: language || "vn", 
        vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
        vnp_OrderType: "other",
        vnp_ReturnUrl,
        vnp_TxnRef: orderId,
    };

    if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params); 
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    vnp_Params["vnp_SecureHash"] = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return `${vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`;
};

// Tạo đơn hàng
const placeOrder = async (req, res) => {
    const { userId, items, amount, address, bankCode, language } = req.body;

    // Kiểm tra đầu vào
    if (!userId || !items || !amount || !address) {
        return res.status(400).json({ success: false, message: "Invalid input" });
    }

    try {
        // Tạo đơn hàng mới và lưu vào cơ sở dữ liệu
        const newOrder = new orderModel({ userId, items, amount, address });
        await newOrder.save();

        // Làm rỗng giỏ hàng của người dùng
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Lấy địa chỉ IP của người dùng
        let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Tạo URL thanh toán VNPay
        const paymentUrl = createVnPayParams(newOrder._id.toString(), amount, language, bankCode, ipAddr);

        // Trả về URL thanh toán cho người dùng
        res.json({ success: true, paymentUrl });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

// Xác minh giao dịch
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            // Thanh toán thành công
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            // Thanh toán thất bại, xóa đơn hàng
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.json({ success: false, message: "Error during verification" });
    }
};

// Lấy danh sách đơn hàng của người dùng
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId:req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// Lấy danh sách tất cả đơn hàng
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// Update order Status
const updateStatus = async(req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
