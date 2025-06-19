// src/services/postService.js
const { Post, User } = require("../models");

const postService = {
  /**
   * Lấy tất cả bài viết, bao gồm thông tin tác giả.
   * @returns {Promise<Array<Post>>} Danh sách bài viết.
   */
  async getAllPosts() {
    return Post.findAll({
      include: [
        {
          model: User,
          as: "author", // Sử dụng alias đã định nghĩa
          attributes: ["id", "username", "email"], // Chỉ lấy các trường cần thiết của User
        },
      ],
    });
  },

  /**
   * Lấy một bài viết theo ID, bao gồm thông tin tác giả.
   * @param {number} id - ID của bài viết.
   * @returns {Promise<Post|null>} Đối tượng bài viết hoặc null nếu không tìm thấy.
   */
  async getPostById(id) {
    return Post.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
      ],
    });
  },

  /**
   * Tạo một bài viết mới.
   * @param {object} postData - Dữ liệu bài viết (title, content, userId).
   * @returns {Promise<Post>} Đối tượng bài viết vừa được tạo.
   * @throws {Error} Nếu userId không được cung cấp hoặc người dùng không tồn tại.
   */
  async createPost(postData) {
    // postData phải bao gồm userId để biết bài viết thuộc về ai
    if (!postData.userId) {
      throw new Error(
        "Post must be associated with a user (userId is required)."
      );
    }
    const userExists = await User.findByPk(postData.userId);
    if (!userExists) {
      throw new Error("User not found.");
    }
    return Post.create(postData);
  },

  /**
   * Cập nhật thông tin bài viết.
   * @param {number} id - ID của bài viết cần cập nhật.
   * @param {object} postData - Dữ liệu mới để cập nhật.
   * @returns {Promise<Post|null>} Đối tượng bài viết đã cập nhật hoặc null nếu không tìm thấy.
   */
  async updatePost(id, postData) {
    const post = await Post.findByPk(id);
    if (!post) {
      return null;
    }
    // Ngăn chặn việc thay đổi userId khi cập nhật post nếu không muốn
    if (postData.userId && postData.userId !== post.userId) {
      const userExists = await User.findByPk(postData.userId);
      if (!userExists) {
        throw new Error("New user for post not found.");
      }
    }
    await post.update(postData);
    return post;
  },

  /**
   * Xóa một bài viết.
   * @param {number} id - ID của bài viết cần xóa.
   * @returns {Promise<boolean>} True nếu xóa thành công, false nếu không tìm thấy bài viết.
   */
  async deletePost(id) {
    const post = await Post.findByPk(id);
    if (!post) {
      return false;
    }
    await post.destroy();
    return true;
  },
};

module.exports = postService;
