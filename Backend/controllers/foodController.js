import cloudinary from 'cloudinary';
import foodModel from "../models/foodModel.js";
import dotenv from 'dotenv';
import fs from "fs";

// Nạp các biến môi trường từ tệp .env
dotenv.config();

// Cấu hình Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Thêm món ăn với upload Cloudinary
const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    // Upload file lên Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "FoodImages", // Thư mục trên Cloudinary
    });

    // Lưu thông tin món ăn vào database
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: result.secure_url, // Lưu URL ảnh từ Cloudinary
    });

    await food.save();

    // Xóa file tạm sau khi upload thành công
    fs.unlinkSync(req.file.path);

    res.json({ success: true, message: "Food added successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Danh sách món ăn
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Xóa món ăn và hình ảnh từ Cloudinary
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found." });
    }

    // Xóa hình ảnh từ Cloudinary
    const publicId = food.image.split('/').pop().split('.')[0]; 
    await cloudinary.v2.uploader.destroy(publicId);

    // Xóa món ăn trong database
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

export { addFood, listFood, removeFood };
