// src/routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Định nghĩa các route cho User API
// GET /api/users - Lấy tất cả người dùng
router.get("/", userController.getUsers);
// GET /api/users/:id - Lấy người dùng theo ID
router.get("/:id", userController.getUser);
// POST /api/users - Tạo người dùng mới
router.post("/", userController.createUser);
// PUT /api/users/:id - Cập nhật người dùng theo ID
router.put("/:id", userController.updateUser);
// DELETE /api/users/:id - Xóa người dùng theo ID
router.delete("/:id", userController.deleteUser);

module.exports = router;
