import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"; // Import thư viện JSON Web Token để tạo token
import bcrypt from "bcrypt"; // Import thư viện bcrypt để mã hóa mật khẩu
import validator from "validator"; // Import thư viện validator để kiểm tra tính hợp lệ của email

// Hàm đăng nhập người dùng
const loginUser = async (req, res) => {
    const { email, password } = req.body; // Lấy email và password từ yêu cầu HTTP
    try {
        // Tìm người dùng trong cơ sở dữ liệu theo email
        const user = await userModel.findOne({ email });
        
        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(password, user.password);

        // Nếu mật khẩu không khớp, trả về thông báo lỗi
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Tạo token cho người dùng sau khi đăng nhập thành công
        const token = createToken(user._id);

        // Trả về kết quả với token cho người dùng
        res.json({ success: true, token });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Hàm tạo token JWT
const createToken = (id) => {
    // Tạo token với ID người dùng và bí mật từ môi trường
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Hàm đăng ký người dùng
const registerUser = async (req, res) => {
    const { name, password, email } = req.body; // Lấy tên, email và mật khẩu từ yêu cầu HTTP
    try {
        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Kiểm tra tính hợp lệ của email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Mã hóa mật khẩu người dùng
        const salt = await bcrypt.genSalt(10); // Tạo salt với độ dài 10
        const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu

        // Tạo người dùng mới và lưu vào cơ sở dữ liệu
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Lưu người dùng mới và tạo token
        const user = await newUser.save();
        const token = createToken(user._id);

        // Trả về kết quả với token cho người dùng
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { loginUser, registerUser }; 
