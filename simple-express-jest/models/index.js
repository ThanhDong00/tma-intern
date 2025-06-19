const { sequelize } = require("../database");
const User = require("./user"); // Import User model
const Post = require("./post"); // Import Post model

// Định nghĩa mối quan hệ 1-nhiều giữa User và Post
// Một User có nhiều Posts (User.hasMany(Post))
// Một Post thuộc về một User (Post.belongsTo(User))
User.hasMany(Post, {
  foreignKey: "userId", // Khóa ngoại trong bảng `posts` sẽ là `userId`
  as: "posts", // Alias để truy cập các bài viết của người dùng (user.posts)
  onDelete: "CASCADE", // Khi User bị xóa, tất cả Posts liên quan cũng sẽ bị xóa
});
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author", // Alias để truy cập tác giả của bài viết (post.author)
});

// Gán instance sequelize và class Sequelize vào đối tượng db để dễ dàng truy cập

module.exports = {
  sequelize, // Instance của Sequelize để kết nối cơ sở dữ liệu
  User, // Model User
  Post, // Model Post
};
