// src/routes/postRoutes.js
const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

// Định nghĩa các route cho Post API
// GET /api/posts - Lấy tất cả bài viết
router.get("/", postController.getPosts);
// GET /api/posts/:id - Lấy bài viết theo ID
router.get("/:id", postController.getPost);
// POST /api/posts - Tạo bài viết mới
router.post("/", postController.createPost);
// PUT /api/posts/:id - Cập nhật bài viết theo ID
router.put("/:id", postController.updatePost);
// DELETE /api/posts/:id - Xóa bài viết theo ID
router.delete("/:id", postController.deletePost);

module.exports = router;
