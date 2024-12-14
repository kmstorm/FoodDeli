import express from 'express';
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from 'multer';
import path from 'path';

const foodRouter = express.Router();

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: "uploads/", // Thư mục lưu trữ tạm
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Các route API
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
