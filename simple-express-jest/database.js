const { Sequelize } = require("sequelize");
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

console.log("Current NODE_ENV:", process.env.NODE_ENV);
console.log("DB_DIALECT:", process.env.DB_DIALECT);
console.log("DB_STORAGE:", process.env.DB_STORAGE);

let sequelize;

if (process.env.DB_DIALECT === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || ":memory:",
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(
      `Database connection has been established successfully. Using dialect: ${process.env.DB_DIALECT}`
    );

    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);

    process.exit(1);
  }
}

module.exports = {
  sequelize,
  connectDB,
};
