import orderModel from "../models/orderModel.js"; 
import userModel from "../models/userModel.js"; 
import axios from "axios"; 
import crypto from "crypto"; 
import moment from "moment"; 
import config from "config"; 
import qs from "qs"; 

// Hàm sắp xếp object theo thứ tự key
const sortObject = (obj) => {
    let sorted = {};
    let keys = Object.keys(obj).sort(); 
    keys.forEach((key) => {
        sorted[key] = obj[key]; 
    });
    return sorted;
};

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
        vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
        vnp_OrderType: "other",
        vnp_ReturnUrl,
        vnp_TxnRef: orderId,
    };

    if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
    }

    // Sắp xếp tham số và ký số
    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    vnp_Params["vnp_SecureHash"] = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return `${vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`;
};

// Tạo đơn hàng
const placeOrder = async (req, res) => {
    const { userId, items, amount, address, bankCode, language } = req.body;

    if (!userId || !items || !amount || !address) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin đầu vào" });
    }

    try {
        const newOrder = new orderModel({ userId, items, amount, address });
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        const paymentUrl = createVnPayParams(newOrder._id.toString(), amount, language, bankCode, ipAddr);

        res.json({ success: true, paymentUrl });
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi khi tạo đơn hàng" });
    }
};

// Xác minh giao dịch
const verifyOrder = async (req, res) => {
    try {
        const vnp_Params = { ...req.query };
        const secureHash = vnp_Params["vnp_SecureHash"];
        const orderId = vnp_Params["vnp_TxnRef"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        const sortedParams = sortObject(vnp_Params);
        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed && vnp_Params["vnp_ResponseCode"] === "00") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Thanh toán thành công" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Thanh toán thất bại" });
        }
    } catch (error) {
        console.error("Lỗi khi xác minh giao dịch:", error);
        res.status(500).json({ success: false, message: "Lỗi khi xác minh giao dịch" });
    }
}

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
