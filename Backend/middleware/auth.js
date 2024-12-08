import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        // Lấy header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please log in again.",
            });
        }

        // Tách token từ chuỗi "Bearer <token>"
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format. Please log in again.",
            });
        }

        // Xác minh token
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenDecoded) {
            return res.status(403).json({
                success: false,
                message: "Failed to authenticate token. Please log in again.",
            });
        }

        // Thêm userId vào req.body để các route khác sử dụng
        req.body.userId = tokenDecoded.id;

        // Gọi middleware tiếp theo
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        // Xử lý lỗi token hết hạn hoặc không hợp lệ
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please log in again.",
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again.",
            });
        }

        // Xử lý lỗi khác
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export default authMiddleware;
