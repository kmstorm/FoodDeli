import orderModel from "../models/orderModel.js"; 
import userModel from "../models/userModel.js"; 
import axios from "axios"; // Import thư viện axios để gọi HTTP request
import crypto from "crypto"; // Import thư viện crypto để tạo chữ ký HMAC
import moment from "moment"; // Import thư viện moment để xử lý thời gian
import config from "config"; // Import thư viện config để lấy cấu hình
import qs from "qs"; // Import thư viện qs để xử lý query string

// Hàm sắp xếp object theo thứ tự key
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    // Lặp qua tất cả các khóa của object
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key)); // Mã hóa khóa của object
        }
    }
    str.sort(); // Sắp xếp danh sách khóa theo thứ tự chữ cái
    // Sắp xếp các giá trị của object theo thứ tự khóa đã sắp xếp
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

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

        // Tạo tham số giao dịch cho URL thanh toán
        const vnp_ReturnUrl = `${process.env.RETURN_URL}/verify?success=true&orderId=${newOrder._id}`;
        const vnp_Url = process.env.VNPAY_URL;
        const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
        const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;

        const createDate = moment().format("YYYYMMDDHHmmss"); // Thời gian tạo đơn hàng
        const orderId = newOrder._id.toString(); // ID đơn hàng
        
        // Lấy địa chỉ IP của người dùng
        let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Tạo tham số gửi cho hệ thống thanh toán VNPay
        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode,
            vnp_Amount: amount * 100, // Chuyển đổi tiền tệ sang đơn vị nhỏ nhất
            vnp_CreateDate: createDate,
            vnp_CurrCode: "VND", // Mã tiền tệ
            vnp_IpAddr: ipAddr,
            vnp_Locale: language || "vn", // Ngôn ngữ mặc định là tiếng Việt
            vnp_OrderInfo: `thanhtoandonhang${orderId}`, // Thông tin đơn hàng
            vnp_OrderType: "other",
            vnp_ReturnUrl,
            vnp_TxnRef: orderId,
        };

        // Thêm mã ngân hàng nếu có
        if (bankCode) {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        // Sắp xếp các tham số và tạo chữ ký
        vnp_Params = sortObject(vnp_Params); // Sắp xếp tham số theo khóa
        const signData = qs.stringify(vnp_Params, { encode: false }); // Chuyển tham số thành chuỗi query string
        const hmac = crypto.createHmac("sha512", vnp_HashSecret); // Tạo chữ ký HMAC với thuật toán SHA-512
        vnp_Params["vnp_SecureHash"] = hmac.update(Buffer.from(signData, "utf-8")).digest("hex"); // Thêm chữ ký vào tham số

        // Ghi lại các tham số và URL thanh toán để kiểm tra
        console.log('vnp_Params:', vnp_Params);
        console.log('paymentUrl:', `${vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`);

        // Trả về URL thanh toán cho người dùng
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
        const vnp_Params = { ...req.query }; // Lấy tham số từ query string
        const secureHash = vnp_Params["vnp_SecureHash"];
        const orderId = vnp_Params["vnp_TxnRef"];

        delete vnp_Params["vnp_SecureHash"]; // Xóa chữ ký khỏi tham số để xác minh
        delete vnp_Params["vnp_SecureHashType"]; // Xóa loại chữ ký

        // Sắp xếp các tham số và tạo chữ ký để so sánh
        const sortedParams = sortObject(vnp_Params);
        const vnp_HashSecret = config.get("vnp_HashSecret"); // Lấy bí mật từ cấu hình
        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        // So sánh chữ ký nhận được với chữ ký tính toán
        if (secureHash === signed && vnp_Params["vnp_ResponseCode"] === "00") {
            // Nếu thành công, cập nhật đơn hàng là đã thanh toán
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            // Nếu thất bại, xóa đơn hàng
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

    // Kiểm tra nếu không có userId
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        // Lấy đơn hàng của người dùng từ cơ sở dữ liệu
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
        // Lấy tất cả đơn hàng từ cơ sở dữ liệu
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

export { placeOrder, verifyOrder, userOrders, listOrders,updateStatus }; // Xuất các hàm để sử dụng ở nơi khác
