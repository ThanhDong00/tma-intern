const { User, Post } = require("../models/index.js");

const userService = {
  /**
   * Lấy tất cả người dùng, bao gồm tất cả các bài viết của họ.
   * @returns {Promise<Array<User>>} Danh sách người dùng.
   */
  async getAllUsers() {
    return User.findAll({
      include: [
        {
          model: Post,
          as: "posts", // Sử dụng alias đã định nghĩa trong index.js
        },
      ],
    });
  },

  /**
   * Lấy một người dùng theo ID, bao gồm tất cả các bài viết của họ.
   * @param {number} id - ID của người dùng.
   * @returns {Promise<User|null>} Đối tượng người dùng hoặc null nếu không tìm thấy.
   */
  async getUserById(id) {
    return User.findByPk(id, {
      include: [
        {
          model: Post,
          as: "posts",
        },
      ],
    });
  },

  /**
   * Tạo một người dùng mới.
   * @param {object} userData - Dữ liệu người dùng (username, email).
   * @returns {Promise<User>} Đối tượng người dùng vừa được tạo.
   */
  async createUser(userData) {
    return User.create(userData);
  },

  /**
   * Cập nhật thông tin người dùng.
   * @param {number} id - ID của người dùng cần cập nhật.
   * @param {object} userData - Dữ liệu mới để cập nhật.
   * @returns {Promise<User|null>} Đối tượng người dùng đã cập nhật hoặc null nếu không tìm thấy.
   */
  async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    await user.update(userData);
    return user;
  },

  /**
   * Xóa một người dùng.
   * @param {number} id - ID của người dùng cần xóa.
   * @returns {Promise<boolean>} True nếu xóa thành công, false nếu không tìm thấy người dùng.
   */
  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      return false;
    }
    await user.destroy();
    return true;
  },
};

module.exports = userService;
