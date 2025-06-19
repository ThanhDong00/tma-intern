const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Đảm bảo username là duy nhất
      validate: {
        notEmpty: true, // Không cho phép chuỗi rỗng
        len: [3, 50], // Độ dài từ 3 đến 50 ký tự
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Đảm bảo email là duy nhất
      validate: {
        isEmail: true, // Kiểm tra định dạng email hợp lệ
        notEmpty: true,
      },
    },
  },
  {
    tableName: "users",
    timestamps: true, // Adds createdAt and updatedAt fields
    underscored: true, // Sử dụng snake_case cho tên cột
  }
);

module.exports = User;
