require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
const express = require("express");
const { connectDB } = require("./database"); // Import hàm kết nối DB
const userRoutes = require("./routes/userRoutes"); // Import User routes
const postRoutes = require("./routes/postRoutes"); // Import Post routes
const { sequelize } = require("./models/index.js"); // Import sequelize instance từ models/index.js (không cần thiết trực tiếp nhưng tốt cho sự nhất quán)

const app = express();
const PORT = process.env.PORT || 3000; // Sử dụng cổng từ biến môi trường hoặc mặc định 3000

// Middleware để phân tích cú pháp JSON từ body của request
app.use(express.json());
// Middleware để phân tích cú pháp URL-encoded data (nếu cần)
app.use(express.urlencoded({ extended: true }));

// Cấu hình các route API
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Xử lý lỗi 404 (Not Found) cho các endpoint không tồn tại
app.use((req, res, next) => {
  res.status(404).json({
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Middleware xử lý lỗi chung. Đây là middleware cuối cùng trong chuỗi.
// Nó bắt tất cả các lỗi không được xử lý ở các middleware hoặc route trước đó.
app.use((err, req, res, next) => {
  console.error(err.stack); // In stack trace của lỗi ra console để debug
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

/**
 * Hàm khởi động server: kết nối DB và lắng nghe các yêu cầu.
 */
async function startServer() {
  await connectDB(); // Gọi hàm kết nối và đồng bộ hóa DB

  // Lắng nghe các yêu cầu trên cổng đã định nghĩa
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${
        process.env.NODE_ENV || "development"
      } mode`
    );
  });
}

// Chỉ khởi động server nếu không phải trong môi trường test
// Jest sẽ tự quản lý server trong môi trường test thông qua setup.js
if (process.env.NODE_ENV !== "test") {
  startServer();
}

// Export đối tượng app để Supertest có thể sử dụng cho integration testing
module.exports = app;
