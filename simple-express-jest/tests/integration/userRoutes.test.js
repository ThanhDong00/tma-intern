const request = require("supertest");
const app = require("../../index.js");
const { sequelize } = require("../../models/index.js");

describe("User API", () => {
  beforeEach(async () => {
    // Làm sạch DB trước mỗi test
    await sequelize.sync({ force: false });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("GET /users", () => {
    // --- Test POST /api/users ---
    it("should create a new user", async () => {
      const newUser = {
        username: "John Doe",
        email: "JohnDoe@gmail.com",
      };
      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty("id"); // Kiểm tra người dùng có ID
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.email).toBe(newUser.email);
    });

    // --- Test GET /api/users ---
    it("should return a list of users", async () => {
      const response = await request(app).get("/api/users");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    // --- Test GET /api/users/:id ---
    it("should return a user by ID", async () => {
      const response = await request(app).get("/api/users/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(1);
      expect(response.body.username).toBe("John Doe");
    });

    // --- Test PUT /api/users/:id ---
    it("should update a user by ID", async () => {
      const updatedUser = {
        username: "Jane Doe",
        email: "JohnDoe@gmail.com",
      };
      const response = await request(app).put("/api/users/1").send(updatedUser);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body.email).toBe(updatedUser.email);
    });
  });
});
