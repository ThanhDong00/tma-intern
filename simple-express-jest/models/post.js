const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 255], // Tiêu đề từ 5 đến 255 ký tự
      },
    },
    content: {
      type: DataTypes.TEXT, // Kiểu TEXT cho nội dung dài
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 10000], // Nội dung từ 10 đến 10000 ký tự
      },
    },
    // userId sẽ được tự động thêm bởi Sequelize khi thiết lập mối quan hệ
  },
  {
    tableName: "posts", // Tên bảng trong cơ sở dữ liệu
    timestamps: true,
    underscored: true,
  }
);

module.exports = Post;
