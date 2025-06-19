const userService = require("../../services/userService");
const { User, Post } = require("../../models/index.js");

jest.mock("../../models/index.js", () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const mockUsers = [
  {
    id: 1,
    username: "user1",
    email: "user1@gmail.com",
    posts: [
      {
        id: 1,
        title: "title1",
        content: "content1234567892",
        userId: 1,
      },
      {
        id: 2,
        title: "title2",
        content: "content1234567892",
        userId: 1,
      },
    ],
  },
  {
    id: 2,
    username: "user2",
    email: "user2@gmail.com",
    posts: [
      {
        id: 3,
        title: "title3",
        content: "content1234567892",
        userId: 2,
      },
    ],
  },
];

describe("User Service", () => {
  afterEach(() => jest.clearAllMocks());

  // GET /api/users
  test("should fetch all users with their posts", async () => {
    User.findAll.mockResolvedValue(mockUsers);

    const users = await userService.getAllUsers();
    expect(users).toEqual(mockUsers);
    expect(User.findAll).toHaveBeenCalledWith({
      include: [{ model: Post, as: "posts" }],
    });
  });

  // GET /api/users/:id
  test("should fetch a user by ID with their posts", async () => {
    const userId = 1;
    User.findByPk.mockResolvedValue(mockUsers[0]);

    const user = await userService.getUserById(userId);
    expect(user).toEqual(mockUsers[0]);
    expect(User.findByPk).toHaveBeenCalledWith(userId, {
      include: [{ model: Post, as: "posts" }],
    });
  });

  test("should return null if user not found", async () => {
    const userId = 999;
    User.findByPk.mockResolvedValue(null);

    const user = await userService.getUserById(userId);
    expect(user).toBeNull();
    expect(User.findByPk).toHaveBeenCalledWith(userId, {
      include: [{ model: Post, as: "posts" }],
    });
  });

  // POST /api/users
  test("should create a new user", async () => {
    const newUser = { username: "user3", email: "user3@gmail.com" };

    User.create.mockResolvedValue({ id: 3, ...newUser, posts: [] });

    const createdUser = await userService.createUser(newUser);
    expect(createdUser).toEqual({ id: 3, ...newUser, posts: [] });
    expect(User.create).toHaveBeenCalledWith(newUser);
  });

  // PUT /api/users/:id
  test("should update a user", async () => {
    const userId = 1;
    const existingUser = {
      id: 1,
      username: "user1",
      email: "user1@gmail.com",
      update: jest.fn().mockResolvedValue(),
    };
    User.findByPk.mockResolvedValue(existingUser);

    const updatedData = { username: "updatedUser1" };
    const updatedUser = await userService.updateUser(userId, updatedData);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(existingUser.update).toHaveBeenCalledWith(updatedData);
  });
});
