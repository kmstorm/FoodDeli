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
	for (key in obj){
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

// Tạo đơn hàng
const placeOrder = async (req, res) => {
    const { userId, items, amount, address, bankCode, language } = req.body;

    if (!userId || !items || !amount || !address) {
        return res.status(400).json({ success: false, message: "Invalid input" });
    }

    try {
        // Tạo đơn hàng mới
        const newOrder = new orderModel({ userId, items, amount, address });
        await newOrder.save();

        // Làm rỗng dữ liệu giỏ hàng
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Tạo tham số giao dịch
        const vnp_ReturnUrl = `${process.env.RETURN_URL}/verify?success=true&orderId=${newOrder._id}`;
        const vnp_Url = process.env.VNPAY_URL;
        const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;

        const createDate = moment().format("YYYYMMDDHHmmss");
        const orderId = newOrder._id.toString();
        
        // Lấy địa chỉ IP
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ;


        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode,
            vnp_Amount: amount * 100,
            vnp_CreateDate: createDate,
            vnp_CurrCode: "VND",
            vnp_IpAddr: ipAddr,
            vnp_Locale: language || "vn",
            vnp_OrderInfo: `thanhtoandonhang${orderId}`,
            vnp_OrderType: "other",
            vnp_ReturnUrl,
            vnp_TxnRef: orderId,
        };

        if (bankCode) {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        // Sắp xếp tham số và tạo chữ ký
        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        vnp_Params["vnp_SecureHash"] = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        // Ghi lại các tham số và URL thanh toán
        console.log('vnp_Params:', vnp_Params);
        console.log('paymentUrl:', `${vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`);

        // Chuyển hướng đến URL thanh toán
        const paymentUrl = `${vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`;
        res.json({ success: true, paymentUrl });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
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

        const vnp_HashSecret = config.get("vnp_HashSecret");
        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed && vnp_Params["vnp_ResponseCode"] === "00") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Error verifying order" });
    }
};

// Lấy danh sách đơn hàng của người dùng
const userOrders = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const orders = await orderModel.find({ userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching user orders" });
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

export { placeOrder, verifyOrder, userOrders, listOrders };
