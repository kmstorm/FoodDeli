# Dự án Frontend - FoodDeli

## Giới thiệu
Dự án FoodDeli là một ứng dụng web được xây dựng bằng React và Vite, cung cấp một giao diện người dùng thân thiện để đặt hàng thực phẩm trực tuyến. 
## Công nghệ sử dụng
- **React**: Thư viện JavaScript phổ biến để xây dựng giao diện người dùng.
- **Vite**: Công cụ xây dựng nhanh chóng cho các ứng dụng web, giúp cải thiện hiệu suất phát triển.
- **CSS**: Để tạo kiểu cho giao diện người dùng, bao gồm cả Flexbox và Grid cho bố cục linh hoạt.
- **React Router**: Để quản lý điều hướng giữa các trang trong ứng dụng.

## Cài đặt
Để chạy dự án này trên máy tính của bạn, hãy làm theo các bước sau:

1. **Clone repository**:
   ```bash
   git clone https://github.com/kmstorm/FoodDeli.git
   ```

2. **Chuyển đến thư mục dự án**:
   ```bash
   cd FoodDeli
   ```

3. **Cài đặt các phụ thuộc**:
   ```bash
   npm install
   ```

4. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```

5. **Mở trình duyệt**: Truy cập `http://localhost:5137` để xem ứng dụng.

## Cấu trúc dự án
```
FoodDeli/
├── public/          # Thư mục chứa các tài nguyên tĩnh (hình ảnh, favicon, v.v.)
├── src/             # Thư mục chứa mã nguồn
│   ├── components/  # Các component React tái sử dụng
│   ├── pages/       # Các trang của ứng dụng (Home, Cart, Checkout, v.v.)
│   ├── App.jsx      # Component chính của ứng dụng
│   ├── index.js     # Entry point của ứng dụng
│   └── context/       # chia sẻ dữ liệu giữa component
├── package.json      # Thông tin về dự án và các phụ thuộc
└── README.md         # Tài liệu hướng dẫn sử dụng dự án
```

## Tính năng
- **Duyệt món ăn**: Người dùng có thể xem danh sách các món ăn có sẵn.
- **Giỏ hàng**: Người dùng có thể thêm món ăn vào giỏ hàng (chưa có chức năng thanh toán).
- **Giao diện thân thiện**: Thiết kế giao diện người dùng dễ sử dụng và trực quan.


