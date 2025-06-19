// src/controllers/postController.js
const postService = require("../services/postService");
const { SequelizeValidationError } = require("sequelize");

const postController = {
  /**
   * Lấy tất cả bài viết.
   * GET /api/posts
   */
  async getPosts(req, res) {
    try {
      const posts = await postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  /**
   * Lấy một bài viết theo ID.
   * GET /api/posts/:id
   */
  async getPost(req, res) {
    try {
      const post = await postService.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error(`Error fetching post with ID ${req.params.id}:`, error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  /**
   * Tạo một bài viết mới.
   * POST /api/posts
   */
  async createPost(req, res) {
    try {
      const newPost = await postService.createPost(req.body);
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      if (
        error.message.includes("User not found") ||
        error.message.includes("userId is required")
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error instanceof SequelizeValidationError) {
        const errors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        return res
          .status(400)
          .json({ message: "Validation error", errors: errors });
      }
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  /**
   * Cập nhật thông tin bài viết.
   * PUT /api/posts/:id
   */
  async updatePost(req, res) {
    try {
      const updatedPost = await postService.updatePost(req.params.id, req.body);
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error(`Error updating post with ID ${req.params.id}:`, error);
      if (error.message.includes("User not found")) {
        return res.status(400).json({ message: error.message });
      }
      if (error instanceof SequelizeValidationError) {
        const errors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        return res
          .status(400)
          .json({ message: "Validation error", errors: errors });
      }
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  /**
   * Xóa một bài viết.
   * DELETE /api/posts/:id
   */
  async deletePost(req, res) {
    try {
      const deleted = await postService.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(204).send(); // 204 No Content
    } catch (error) {
      console.error(`Error deleting post with ID ${req.params.id}:`, error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

module.exports = postController;
