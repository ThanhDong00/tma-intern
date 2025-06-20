const postService = require("../../services/postService");
const { Post, User } = require("../../models/index.js");

jest.mock("../../models/index.js", () => ({
  Post: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

const mockPosts = [
  {
    id: 1,
    title: "Post 1",
    content: "Content of post 1",
    userId: 1,
    author: {
      id: 1,
      username: "user1",
      email: "user1@gmail.com",
    },
  },
  {
    id: 2,
    title: "Post 2",
    content: "Content of post 2",
    userId: 1,
    author: {
      id: 1,
      username: "user1",
      email: "user1@gmail.com",
    },
  },
  {
    id: 3,
    title: "Post 3",
    content: "Content of post 3",
    userId: 2,
    author: {
      id: 2,
      username: "user2",
      email: "user2@gmail.com",
    },
  },
];

describe("Post Service", () => {
  afterEach(() => jest.clearAllMocks());

  // GET /api/posts
  test("should fetch all posts with their authors", async () => {
    Post.findAll.mockResolvedValue(mockPosts);

    const posts = await postService.getAllPosts();
    expect(posts).toEqual(mockPosts);
    expect(Post.findAll).toHaveBeenCalledWith({
      include: [
        { model: User, as: "author", attributes: ["id", "username", "email"] },
      ],
    });
  });

  // GET /api/posts/:id
  test("should fetch a post by ID with its author", async () => {
    const postId = 1;
    Post.findByPk.mockResolvedValue(mockPosts[0]);

    const post = await postService.getPostById(postId);
    expect(post).toEqual(mockPosts[0]);
    expect(Post.findByPk).toHaveBeenCalledWith(postId, {
      include: [
        { model: User, as: "author", attributes: ["id", "username", "email"] },
      ],
    });
  });

  // POST /api/posts
  test("should create a new post", async () => {
    const newPostData = {
      title: "New Post",
      content: "Content of the new post",
      userId: 1,
    };

    User.findByPk.mockResolvedValue({
      id: 1,
      username: "user1",
      email: "user1@gmail.com",
    });
    Post.create.mockResolvedValue({ ...newPostData, id: 4 });

    const createdPost = await postService.createPost(newPostData);
    expect(createdPost).toEqual({ ...newPostData, id: 4 });
    expect(Post.create).toHaveBeenCalledWith(newPostData);
  });

  test("should throw an error if userId is not provided when creating a post", async () => {
    const newPostData = {
      title: "New Post",
      content: "Content of the new post",
    };

    await expect(postService.createPost(newPostData)).rejects.toThrow(
      "Post must be associated with a user (userId is required)."
    );
    expect(Post.create).not.toHaveBeenCalled();
  });

  test("should throw an error if user does not exist when creating a post", async () => {
    const newPostData = {
      title: "New Post",
      content: "Content of the new post",
      userId: 999,
    };

    User.findByPk.mockResolvedValue(null);

    await expect(postService.createPost(newPostData)).rejects.toThrow(
      "User not found."
    );
    expect(Post.create).not.toHaveBeenCalled();
  });

  // PUT /api/posts/:id
  test("should update a post", async () => {
    const postId = 1;
    const existingPost = {
      id: postId,
      userId: 1,
      title: "Post 1",
      content: "Content of post 1",
      update: jest.fn().mockResolvedValue(),
    };

    Post.findByPk.mockResolvedValue(existingPost);

    const updatedPostData = {
      title: "Updated Post 1",
      content: "Updated content of post 1",
    };

    const updatedPost = await postService.updatePost(postId, updatedPostData);

    expect(Post.findByPk).toHaveBeenCalledWith(postId);
    expect(existingPost.update).toHaveBeenCalledWith(updatedPostData);
  });

  test("should return null if post not found when updating", async () => {
    const postId = 999;

    Post.findByPk.mockResolvedValue(null);

    const updatedPost = await postService.updatePost(postId, {});

    expect(updatedPost).toBeNull();
    expect(Post.findByPk).toHaveBeenCalledWith(postId);
  });

  test("should throw an error if new userId does not exist when updating a post", async () => {
    const userId = 999;
    const postId = 1;

    const existingPost = {
      id: postId,
      userId: 1,
      title: "Post 1",
      content: "Content of post 1",
      update: jest.fn().mockResolvedValue(),
    };

    Post.findByPk.mockResolvedValue(existingPost);
    User.findByPk.mockResolvedValue(null);

    await expect(postService.updatePost(postId, { userId })).rejects.toThrow(
      "New user for post not found."
    );
    expect(Post.findByPk).toHaveBeenCalledWith(postId);
    expect(User.findByPk).toHaveBeenCalledWith(userId);
    expect(existingPost.update).not.toHaveBeenCalled();
  });

  // DELETE /api/posts/:id
  test("should delete a post", async () => {
    const postId = 1;
    const existingPost = {
      id: postId,
      userId: 1,
      title: "Post 1",
      content: "Content of post 1",
      destroy: jest.fn().mockResolvedValue(),
    };

    Post.findByPk.mockResolvedValue(existingPost);

    const result = await postService.deletePost(postId);
    expect(result).toBe(true);
    expect(Post.findByPk).toHaveBeenCalledWith(postId);
    expect(existingPost.destroy).toHaveBeenCalled();
  });

  test("should return false if post to delete not found", async () => {
    const postId = 999;

    Post.findByPk.mockResolvedValue(null);

    const result = await postService.deletePost(postId);
    expect(result).toBe(false);
    expect(Post.findByPk).toHaveBeenCalledWith(postId);
  });
});
