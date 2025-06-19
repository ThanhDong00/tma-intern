// src/controllers/userController.js
const userService = require("../services/userService");
const {
  SequelizeUniqueConstraintError,
  SequelizeValidationError,
} = require("sequelize");

const userController = {
  /**
   * Lấy tất cả người dùng.
   * GET /api/users
   */
  async getUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  /**
   * Lấy một người dùng theo ID.
   * GET /api/users/:id
   */
  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(`Error fetching user with ID ${req.params.id}:`, error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  /**
   * Tạo một người dùng mới.
   * POST /api/users
   */
  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error.message);
      // Xử lý lỗi validation (ví dụ: trường rỗng, định dạng sai)
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
   * Cập nhật thông tin người dùng.
   * PUT /api/users/:id
   */
  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(`Error updating user with ID ${req.params.id}:`, error);
      if (error instanceof SequelizeUniqueConstraintError) {
        return res.status(400).json({
          message: "Username or email already exists.",
          fields: error.fields,
        });
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
   * Xóa một người dùng.
   * DELETE /api/users/:id
   */
  async deleteUser(req, res) {
    try {
      const deleted = await userService.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).send(); // 204 No Content - Không trả về nội dung sau khi xóa thành công
    } catch (error) {
      console.error(`Error deleting user with ID ${req.params.id}:`, error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

module.exports = userController;
